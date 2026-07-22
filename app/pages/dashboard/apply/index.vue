<script setup lang="ts">
import type {Application} from "~/types/application";

definePageMeta({
    layout: 'dashboard',
    breadCrumb: [
        {title: 'Apply'}
    ]
})

const {$axios} = useNuxtApp()
const toast = useToastCustom()
const router = useRouter()

const applications = ref<Application[]>([])
const isLoading = ref(true)
const stats = ref({total: 0, draft: 0, sent: 0})
const filterStatus = ref<'all' | 'draft' | 'sent'>('all')

const fetchData = async () => {
    isLoading.value = true
    try {
        const [appsRes, statsRes] = await Promise.all([
            $axios.get<BaseResponse<Application[]>>('/api/applications'),
            $axios.get<BaseResponse<{ total: number; draft: number; sent: number }>>('/api/applications/stats'),
        ])
        applications.value = appsRes.data?.data ?? []
        stats.value = statsRes.data?.data ?? {total: 0, draft: 0, sent: 0}
    } catch (err) {
        console.error(err)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchData)

const filteredApps = computed(() => {
    if (filterStatus.value === 'all') return applications.value
    return applications.value.filter(a => a.status === filterStatus.value)
})

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    })
}

const handleDelete = async (id: string) => {
    toast.showConfirmationToast('Delete', 'Are you sure?', async () => {
        try {
            await $axios.delete(`/api/applications/${id}`)
            toast.showSuccessToast('Deleted', 'Application deleted')
            await fetchData()
        } catch {
            toast.showErrorToast('Error', 'Failed to delete')
        }
    })
}
</script>

<template>
    <div class="p-8">
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-4xl font-black text-white mb-2">Job Applications</h1>
                <p class="text-white/60">Manage your job applications</p>
            </div>
            <NuxtLink
                to="/dashboard/apply/new"
                class="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all flex items-center gap-2"
            >
                <Icon name="carbon:add" size="20"/>
                New Application
            </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                <p class="text-2xl font-bold text-white">{{ stats.total }}</p>
                <p class="text-sm text-white/50">Total</p>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                <p class="text-2xl font-bold text-yellow-400">{{ stats.draft }}</p>
                <p class="text-sm text-white/50">Draft</p>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                <p class="text-2xl font-bold text-green-400">{{ stats.sent }}</p>
                <p class="text-sm text-white/50">Sent</p>
            </div>
        </div>

        <div class="flex gap-2 mb-6">
            <button
                v-for="f in (['all', 'draft', 'sent'] as const)"
                :key="f"
                @click="filterStatus = f"
                :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    filterStatus === f
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                ]"
            >
                {{ f.charAt(0).toUpperCase() + f.slice(1) }}
            </button>
        </div>

        <div v-if="isLoading" class="flex justify-center py-20">
            <Icon name="line-md:loading-loop" size="32" class="text-primary"/>
        </div>

        <div v-else-if="filteredApps.length === 0" class="text-center py-20">
            <Icon name="carbon:document" size="48" class="text-white/20 mx-auto mb-4"/>
            <p class="text-white/50">No applications yet</p>
            <NuxtLink to="/dashboard/apply/new" class="text-primary hover:underline text-sm mt-2 inline-block">
                Create your first application
            </NuxtLink>
        </div>

        <div v-else class="space-y-3">
            <NuxtLink
                v-for="app in filteredApps"
                :key="app.id"
                :to="`/dashboard/apply/${app.id}`"
                class="block bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary/50 hover:bg-white/[0.07] transition-all group"
            >
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                            <Icon name="carbon:building" size="20" class="text-primary"/>
                        </div>
                        <div>
                            <p class="text-white font-semibold">{{ app.company_name }}</p>
                            <p class="text-white/50 text-sm">{{ app.position }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="text-xs text-white/40">{{ formatDate(app.created_at) }}</span>
                        <span
                            :class="[
                                'px-3 py-1 rounded-full text-xs font-semibold border',
                                app.status === 'sent'
                                    ? 'bg-green-500/20 text-green-400 border-green-500/40'
                                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                            ]"
                        >
                            {{ app.status === 'sent' ? 'Sent' : 'Draft' }}
                        </span>
                        <button
                            @click.prevent="handleDelete(app.id)"
                            class="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"
                        >
                            <Icon name="carbon:trash-can" size="18"/>
                        </button>
                    </div>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>
