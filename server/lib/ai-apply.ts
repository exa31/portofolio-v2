import {GoogleGenAI} from "@google/genai";
import {query} from "~~/server/db/postgres";
import {HttpError} from "~~/server/errors/HttpError";

interface PortfolioData {
    settings: any;
    skills: any[];
    projects: any[];
    journeys: any[];
}

async function fetchPortfolioData(userId: string): Promise<PortfolioData> {
    const settingsResult = await query(`
        SELECT name, email, location, open_to_opportunities, github_profile, linkedin_profile, cv_url
        FROM users WHERE id = $1 LIMIT 1
    `, [userId]);

    const skillsResult = await query(`
        SELECT name FROM skills ORDER BY name ASC
    `);

    const projectsResult = await query(`
        SELECT p.name, p.description, p.status, p.start_date, p.end_date,
               p.features, p.live_url, p.repo_url,
               ARRAY_AGG(s.name) AS technologies
        FROM projects p
        JOIN project_skills ps ON p.id = ps.project_id
        JOIN skills s ON ps.skill_id = s.id
        GROUP BY p.id
        ORDER BY p.start_date DESC
    `);

    const journeysResult = await query(`
        SELECT j.title, j.company, j.location, j.start_date, j.end_date,
               j.key_responsibilities, j.description, j.is_current,
               ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) AS skills
        FROM journeys j
        LEFT JOIN journey_skills js ON j.id = js.journey_id
        LEFT JOIN skills s ON js.skill_id = s.id
        GROUP BY j.id
        ORDER BY j.start_date DESC
    `);

    return {
        settings: settingsResult.rows[0] || null,
        skills: skillsResult.rows,
        projects: projectsResult.rows,
        journeys: journeysResult.rows,
    };
}

function buildPortfolioContext(data: PortfolioData): string {
    let context = '';

    if (data.settings) {
        const s = data.settings;
        context += `=== PROFILE ===\n`;
        context += `Name: ${s.name}\n`;
        context += `Role: Full-Stack Developer\n`;
        context += `Location: ${s.location || 'Tegal, Central Java, Indonesia'}\n`;
        context += `Status: ${s.open_to_opportunities ? 'Open to work' : 'Not currently open to work'}\n`;
        context += `Email: ${s.email}\n`;
        context += `Portfolio: https://eka-dev.cloud\n`;
        if (s.github_profile) context += `GitHub: ${s.github_profile}\n`;
        if (s.linkedin_profile) context += `LinkedIn: ${s.linkedin_profile}\n`;
        if (s.cv_url) context += `CV URL: ${s.cv_url}\n`;
        context += '\n';
    }

    if (data.skills.length > 0) {
        context += `=== SKILLS ===\n`;
        context += data.skills.map(s => `- ${s.name}`).join('\n');
        context += '\n\n';
    }

    if (data.projects.length > 0) {
        context += `=== PROJECTS ===\n`;
        for (const p of data.projects) {
            const features = Array.isArray(p.features) ? p.features.join(', ') : (typeof p.features === 'string' ? p.features : '');
            const tech = Array.isArray(p.technologies) ? p.technologies.filter(Boolean).join(', ') : (typeof p.technologies === 'string' ? p.technologies : '');
            const startYear = p.start_date ? String(p.start_date).split('-')[0] || String(p.start_date).split(' ')[3] || '' : '';
            context += `\n[${p.name}]`;
            if (startYear) context += ` (${startYear})`;
            context += `\n`;
            if (p.description) context += `Description: ${p.description}\n`;
            if (features) context += `Features: ${features}\n`;
            if (tech) context += `Technologies: ${tech}\n`;
            if (p.live_url) context += `Live URL: ${p.live_url}\n`;
            if (p.repo_url) context += `Repository: ${p.repo_url}\n`;
        }
        context += '\n';
    }

    if (data.journeys.length > 0) {
        context += `=== EXPERIENCE ===\n`;
        for (const j of data.journeys) {
            const startStr = j.start_date ? String(j.start_date).split('T')[0] : '';
            const endStr = j.end_date ? String(j.end_date).split('T')[0] : (j.is_current ? 'Present' : '');
            const period = `${startStr} - ${endStr}`;
            const responsibilities = Array.isArray(j.key_responsibilities) ? j.key_responsibilities.join(', ') : (typeof j.key_responsibilities === 'string' ? j.key_responsibilities : '');
            const tech = Array.isArray(j.skills) ? j.skills.filter(Boolean).join(', ') : (typeof j.skills === 'string' ? j.skills : '');
            context += `\n[${j.title}] at ${j.company}\n`;
            if (j.location) context += `Location: ${j.location}\n`;
            context += `Period: ${period}\n`;
            if (j.description) context += `Description: ${j.description}\n`;
            if (responsibilities) context += `Key Responsibilities: ${responsibilities}\n`;
            if (tech) context += `Technologies: ${tech}\n`;
        }
        context += '\n';
    }

    return context;
}

function callGemini(systemPrompt: string): Promise<string> {
    const config = useRuntimeConfig();
    const apiKey = config.geminiApiKey as string | undefined;

    if (!apiKey || apiKey.trim() === '') {
        throw new HttpError(500, 'AI_NOT_CONFIGURED', 'AI service is not configured');
    }

    const ai = new GoogleGenAI({apiKey});

    return ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt,
    }).then(response => {
        const text = response.text;
        if (!text || !text.trim()) {
            throw new HttpError(500, 'EMPTY_AI_RESPONSE', 'AI returned empty response');
        }
        return text.trim();
    });
}

function parseJsonFromResponse(text: string): any {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch {
            // fallback
        }
    }
    return null;
}

export async function generateEmail(
    userId: string,
    data: {
        company_name: string;
        position: string;
        hr_email: string;
        job_description: string;
        job_link?: string | null;
    }
): Promise<{
    subject: string;
    body: string;
    reasoning: string[];
    analysis: string;
}> {
    const portfolioData = await fetchPortfolioData(userId);
    const portfolioContext = buildPortfolioContext(portfolioData);

    const systemPrompt = `You are a professional job application email writer. Your task is to write a personalized application email based on the candidate's CV/portfolio data and the job description.

=== RULES (STRICT) ===
1. NEVER fabricate experience, skills, or achievements not present in the portfolio data
2. NEVER claim proficiency in skills the candidate doesn't have
3. If a requirement is mentioned in the job description but not in the portfolio, do NOT pretend the candidate has it
4. Prioritize the most relevant experience and skills that match the job description
5. Use professional, natural language - don't sound like an AI template
6. Be confident but not arrogant
7. Keep the email concise (2-3 paragraphs max)
8. The email should address the HR/recruiter directly (use "you/your")
9. Mention the specific position and company
10. Include a call to action (e.g., looking forward to discussing)
11. Include a link to the candidate's portfolio website (https://eka-dev.cloud) in the email signature or body

=== PORTFOLIO DATA ===
${portfolioContext}

=== JOB DETAILS ===
Company: ${data.company_name}
Position: ${data.position}
HR Email: ${data.hr_email}
Job Link: ${data.job_link || 'N/A'}

=== JOB DESCRIPTION ===
${data.job_description}

=== OUTPUT FORMAT ===
Respond with ONLY a valid JSON object (no markdown, no code fences):
{
  "subject": "Email subject line",
  "analysis": "Brief analysis of how the candidate's profile matches the job requirements (2-3 sentences)",
  "reasoning": ["bullet point 1 explaining why the email was written this way", "bullet point 2", "bullet point 3"],
  "body": "Full email body in plain text (not HTML). Use proper paragraph breaks."
}`;

    const response = await callGemini(systemPrompt);
    const parsed = parseJsonFromResponse(response);

    if (parsed && parsed.subject && parsed.body) {
        return {
            subject: parsed.subject,
            body: parsed.body,
            reasoning: parsed.reasoning || [],
            analysis: parsed.analysis || '',
        };
    }

    return {
        subject: `Application for ${data.position} at ${data.company_name}`,
        body: response,
        reasoning: ['Email generated based on CV portfolio data and job description'],
        analysis: '',
    };
}

export async function reviseEmail(
    userId: string,
    currentSubject: string,
    currentBody: string,
    jobDescription: string,
    message: string,
    chatHistory: Array<{ role: string; content: string }>
): Promise<{
    reply: string;
    revised_subject?: string;
    revised_body?: string;
    reasoning?: string[];
}> {
    const portfolioData = await fetchPortfolioData(userId);
    const portfolioContext = buildPortfolioContext(portfolioData);

    const historyStr = chatHistory.map(h =>
        `[${h.role}]: ${h.content}`
    ).join('\n');

    const systemPrompt = `You are a professional job application email assistant. You help refine application emails based on user feedback.

=== RULES (STRICT) ===
1. NEVER fabricate experience, skills, or achievements not present in the portfolio data
2. NEVER claim skills the candidate doesn't have
3. All revisions must stay consistent with the CV portfolio data
4. Do not change facts from the CV without user approval
5. Make changes based on the user's instructions only

=== PORTFOLIO DATA ===
${portfolioContext}

=== CURRENT DRAFT ===
Subject: ${currentSubject}

Body:
${currentBody}

=== JOB DESCRIPTION ===
${jobDescription}

=== CHAT HISTORY ===
${historyStr}

=== USER MESSAGE ===
${message}

=== OUTPUT FORMAT ===
Respond with ONLY a valid JSON object (no markdown, no code fences):
{
  "reply": "Your response to the user's message (explain what you changed or answer their question)",
  "revised_subject": "Updated subject line (only if changes were requested, otherwise null)",
  "revised_body": "Updated email body (only if changes were requested, otherwise null)",
  "reasoning": ["bullet point explaining changes made"]
}`;

    const response = await callGemini(systemPrompt);
    const parsed = parseJsonFromResponse(response);

    if (parsed && parsed.reply) {
        return {
            reply: parsed.reply,
            revised_subject: parsed.revised_subject || undefined,
            revised_body: parsed.revised_body || undefined,
            reasoning: parsed.reasoning || [],
        };
    }

    return {
        reply: response,
    };
}
