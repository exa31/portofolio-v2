<script setup lang="ts">
const props = defineProps<{
    subject: string
    body: string
    reasoning: string[]
    readonly?: boolean
}>()

const emit = defineEmits<{
    'update:subject': [value: string]
    'update:body': [value: string]
}>()

const localSubject = ref(props.subject)
const localBody = ref(props.body)

watch(() => props.subject, (v) => { localSubject.value = v })
watch(() => props.body, (v) => { localBody.value = v })

watch(localSubject, (v) => emit('update:subject', v))
watch(localBody, (v) => emit('update:body', v))
</script>

<template>
    <div class="space-y-4">
        <div>
            <label class="block text-sm font-semibold text-white mb-2">Subject</label>
            <input
                v-model="localSubject"
                type="text"
                :readonly="readonly"
                class="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
        </div>

        <div>
            <label class="block text-sm font-semibold text-white mb-2">Email Body</label>
            <textarea
                v-model="localBody"
                :readonly="readonly"
                rows="16"
                class="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all resize-y font-mono text-sm leading-relaxed"
            ></textarea>
            <p class="text-xs text-white/40 mt-1">{{ localBody.length }} characters</p>
        </div>

        <div v-if="reasoning.length > 0">
            <label class="block text-sm font-semibold text-white/60 mb-2">Why this email?</label>
            <ul class="space-y-1.5">
                <li
                    v-for="(point, idx) in reasoning"
                    :key="idx"
                    class="flex items-start gap-2 text-sm text-white/50"
                >
                    <Icon name="carbon:idea" size="16" class="text-primary shrink-0 mt-0.5"/>
                    <span>{{ point }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
