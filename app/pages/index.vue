<script setup lang="ts">
// ========== PROJECTS DATA ==========
import FooterSection from "~/components/FooterSection.vue";

const projects = [
  {
    id: 1,
    title: 'E-Commerce Dashboard',
    description: 'A comprehensive admin panel to utilize modern technologies and manage logistics with intuitive design.',
    shortDesc: 'A comprehensive admin panel to utilize modern technologies and manage logistics with intuitive design.',
    image: '/images/hero.png',
    technologies: ['React', 'Tailwind', 'Recharts'],
    link: 'https://github.com',
    liveUrl: 'https://ecommerce-dashboard-demo.vercel.app',
    details: 'This e-commerce dashboard provides real-time analytics, inventory management, order tracking, and customer insights. Built with React and powered by modern APIs, it delivers a seamless admin experience with interactive charts and responsive design.',
    features: ['Real-time Analytics', 'Order Management', 'Inventory Tracking', 'Customer Analytics', 'Revenue Reports']
  },
  {
    id: 2,
    title: 'Social Connect App',
    description: 'A public-first social platform focused on connecting people with features like posts, chats.',
    shortDesc: 'A public-first social platform focused on connecting people with features like posts, chats.',
    image: '/images/hero.png',
    technologies: ['React Native', 'Firebase', 'Redux'],
    link: 'https://github.com',
    liveUrl: null,
    details: 'Social Connect is a feature-rich mobile application built with React Native, enabling users to create profiles, share posts, engage in real-time messaging, and build communities. With Firebase backend and Redux state management.',
    features: ['User Profiles', 'Real-time Messaging', 'Post Sharing', 'Community Building', 'Push Notifications']
  },
  {
    id: 3,
    title: 'Developer Portfolio V1',
    description: 'My first portfolio site designed to showcase creative coding experiences in creative way.',
    shortDesc: 'My first portfolio site designed to showcase creative coding experiences in creative way.',
    image: '/images/hero.png',
    technologies: ['HTML/CSS', 'JavaScript', 'Figma'],
    link: 'https://github.com',
    liveUrl: 'https://portfolio-v1.vercel.app',
    details: 'An interactive portfolio website showcasing my projects and skills. Built with modern web technologies, featuring smooth animations, responsive design, and engaging UI components.',
    features: ['Interactive UI', 'Responsive Design', 'Project Showcase', 'Smooth Animations', 'Contact Form']
  },
  {
    id: 4,
    title: 'TaskFlow Manager',
    description: 'A productivity tool for managing tasks with real-time collaboration features and seamless sync.',
    shortDesc: 'A productivity tool for managing tasks with real-time collaboration features and seamless sync.',
    image: '/images/hero.png',
    technologies: ['Vue.js', 'Node.js', 'MongoDB'],
    link: 'https://github.com',
    liveUrl: 'https://taskflow-manager.vercel.app',
    details: 'TaskFlow Manager is a collaborative task management platform that helps teams organize workflows efficiently. Features include real-time updates, team collaboration, task prioritization, and detailed progress tracking.',
    features: ['Task Management', 'Team Collaboration', 'Real-time Sync', 'Progress Tracking', 'Notifications']
  },
  {
    id: 5,
    title: 'Realtime Chat App',
    description: 'A socket.io powered messaging application supporting group chats with typing indicators.',
    shortDesc: 'A socket.io powered messaging application supporting group chats with typing indicators.',
    image: '/images/hero.png',
    technologies: ['Socket.io', 'Express'],
    link: 'https://github.com',
    liveUrl: 'https://realtime-chat-app.vercel.app',
    details: 'A modern chat application with real-time messaging capabilities. Built with Socket.io for instant communication, featuring typing indicators, online status, message history, and group chat support.',
    features: ['Real-time Messaging', 'Typing Indicators', 'Group Chats', 'Message History', 'User Status']
  },
  {
    id: 6,
    title: 'SkyChat Weather',
    description: 'A beautiful weather forecast application utilizing geolocation APIs to provide accurate data.',
    shortDesc: 'A beautiful weather forecast application utilizing geolocation APIs to provide accurate data.',
    image: '/images/hero.png',
    technologies: ['Next.js', 'OpenWeatherAPI'],
    link: 'https://github.com',
    liveUrl: 'https://skychat-weather.vercel.app',
    details: 'SkyChat Weather is a sleek weather application that provides real-time weather information based on user location. With beautiful UI design, hourly forecasts, and detailed weather analytics.',
    features: ['Geolocation', 'Real-time Weather', 'Hourly Forecast', 'Weather Analytics', 'Beautiful UI']
  }
]

// ========== EXPERIENCE DATA ==========
const experiences = [
  {
    id: 1,
    company: "PT Astra International Tbk",
    position: "Senior Software Engineer",
    period: "2022 - Present",
    description: "Leading development of enterprise applications using modern web technologies",
    logo: "https://via.placeholder.com/80",
    responsibilities: [
      "Lead a team of 5 developers",
      "Architected microservices infrastructure",
      "Improved system performance by 40%",
    ],
    technologies: ["Vue.js", "Node.js", "AWS", "Docker"],
    attachment: "https://example.com/certificate1.pdf",
  },
  {
    id: 2,
    company: "PT Telkom Indonesia",
    position: "Full Stack Developer",
    period: "2020 - 2022",
    description: "Developed and maintained customer-facing web applications",
    logo: "https://via.placeholder.com/80",
    responsibilities: [
      "Built RESTful APIs",
      "Implemented responsive UI designs",
      "Collaborated with cross-functional teams",
    ],
    technologies: ["React", "Express.js", "PostgreSQL"],
    attachment: "https://example.com/certificate2.pdf",
  },
  {
    id: 3,
    company: "PT Gojek Indonesia",
    position: "Frontend Developer",
    period: "2019 - 2020",
    description: "Created user interfaces for mobile and web platforms",
    logo: "https://via.placeholder.com/80",
    responsibilities: [
      "Developed reusable components",
      "Optimized web performance",
      "Conducted code reviews",
    ],
    technologies: ["Vue.js", "Tailwind CSS", "TypeScript"],
    attachment: null,
  },
]
</script>

<template>
  <div class="text-white">
    <!-- Hero Section -->
    <main class="container mx-auto px-6 py-20">
      <HeroSection/>
    </main>

    <!-- About Section -->
    <AboutSection/>

    <!-- Skills Section -->
    <SkillsSection/>

    <!-- Journey Section -->
    <JourneySection :experiences="experiences"/>

    <!-- Projects Section -->
    <ProjectsSection :projects="projects"/>

    <!-- Contact Section -->
    <ContactSection/>

    <!-- Footer Section -->
    <FooterSection/>

    <!-- AI Assistant Section -->
    <AIAssistant/>

  </div>
</template>

<style scoped>
/* ========== ANIMATIONS ========== */
@keyframes scroll-dot {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateY(12px);
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ========== UTILITY CLASSES ========== */
.animate-scroll-dot {
  animation: scroll-dot 1.8s infinite;
}

/* ========== BUTTON STYLES ========== */
.primary-cta-btn {
  background: linear-gradient(135deg, #1e7fff 0%, #2196f3 50%, #0d47a1 100%);
  box-shadow: 0 10px 35px rgba(30, 127, 255, 0.3);
  transition: all 0.3s ease;
}

.primary-cta-btn:hover {
  box-shadow: 0 15px 45px rgba(30, 127, 255, 0.4);
  transform: translateY(-2px);
}
</style>

