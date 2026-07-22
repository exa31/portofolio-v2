<script setup lang="ts">
import type {GenerateInput} from "~/types/application";

definePageMeta({
    layout: 'dashboard',
    breadCrumb: [
        {title: 'Apply', link: '/dashboard/apply'},
        {title: 'New Application'}
    ]
})

const router = useRouter()
const {generateEmail, isGenerating} = useApply()

const handleGenerate = async (input: GenerateInput) => {
    const result = await generateEmail(input)
    if (result?.application?.id) {
        await router.push(`/dashboard/apply/${result.application.id}`)
    }
}
</script>

<template>
    <div class="p-8">
        <div class="mb-8">
            <h1 class="text-4xl font-black text-white mb-2">New Application</h1>
            <p class="text-white/60">Fill in the job details and generate a personalized application email</p>
        </div>

        <div class="max-w-2xl">
            <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <ApplyInputForm
                    :loading="isGenerating"
                    @submit="handleGenerate"
                />
            </div>
        </div>
    </div>
</template>
