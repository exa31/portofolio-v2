<script setup lang="ts">
const props = defineProps<{
    company_name: string
    position: string
    hr_email: string
    status: 'draft' | 'sent'
    job_link?: string | null
    sent_at?: string | null
}>()
</script>

<template>
    <div class="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
        <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="carbon:building" size="20" class="text-primary"/>
                </div>
                <div>
                    <p class="text-white font-bold text-lg">{{ company_name }}</p>
                    <p class="text-white/60 text-sm">{{ position }}</p>
                </div>
            </div>
            <span
                :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold border',
                    status === 'sent'
                        ? 'bg-green-500/20 text-green-400 border-green-500/40'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                ]"
            >
                {{ status === 'sent' ? 'Sent' : 'Draft' }}
            </span>
        </div>

        <div class="flex items-center gap-2 text-sm text-white/50">
            <Icon name="carbon:email" size="14"/>
            <span>{{ hr_email }}</span>
        </div>

        <div v-if="job_link" class="flex items-center gap-2 text-sm">
            <Icon name="carbon:link" size="14" class="text-primary"/>
            <a
                :href="job_link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline truncate"
            >{{ job_link }}</a>
        </div>

        <div v-if="sent_at" class="flex items-center gap-2 text-xs text-white/40">
            <Icon name="carbon:time" size="12"/>
            <span>Sent {{ new Date(sent_at).toLocaleDateString() }}</span>
        </div>
    </div>
</template>
