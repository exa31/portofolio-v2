<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { formatDistanceToNow } from "date-fns";

definePageMeta({
  layout: "dashboard",
  breadCrumb: [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Lowongan Pekerjaan" },
  ],
});

const { $axios } = useNuxtApp();
const loading = ref(true);
const statsLoading = ref(true);

const jobs = ref<any[]>([]);
const stats = ref<any>({ total: 0, bySource: {}, lastScraped: null });
const page = ref(1);
const totalJobs = ref(0);
const totalPages = computed(() => Math.ceil(totalJobs.value / 20));

// Filters
const search = ref("");
const selectedSource = ref("");
const selectedStatus = ref("active"); // active, archived, all
const selectedJobs = ref<string[]>([]);

const sources = computed(() => Object.keys(stats.value.bySource || {}));

const fetchStats = async () => {
  statsLoading.value = true;
  try {
    const res = await $axios.get("/api/jobs/stats");
    if (res.data.data) {
      stats.value = res.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch job stats:", error);
  } finally {
    statsLoading.value = false;
  }
};

const fetchJobs = async () => {
  loading.value = true;
  try {
    const res = await $axios.get("/api/jobs", {
      params: {
        page: page.value,
        limit: 20,
        search: search.value || undefined,
        source: selectedSource.value || undefined,
        sort: "date",
        status: selectedStatus.value,
      },
    });

    if (res.data.data) {
      jobs.value = res.data.data.data || [];
      totalJobs.value = res.data.data.pagination?.total || 0;
    }
    selectedJobs.value = []; // Reset selection on fetch
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
  } finally {
    loading.value = false;
  }
};

const toast = useToast();
const refreshLimit = ref(10);

const triggerRefresh = async () => {
  try {
    await $axios.post("/api/jobs/refresh", { limit: refreshLimit.value });
    toast.add({ title: "Success", description: `Worker berjalan. Mencari ${refreshLimit.value} loker terbaru.` });
  } catch (error) {
    console.error("Failed to refresh:", error);
    toast.add({ title: "Error", description: "Failed to trigger worker refresh.", color: "red" });
  }
};

const archiveSelectedJobs = async () => {
  if (selectedJobs.value.length === 0) return;
  try {
    await $axios.post("/api/jobs/archive", { ids: selectedJobs.value });
    toast.add({ title: "Success", description: `${selectedJobs.value.length} loker berhasil diarsipkan.` });
    fetchJobs();
  } catch (error) {
    console.error("Failed to archive jobs:", error);
    toast.add({ title: "Error", description: "Gagal mengarsipkan loker.", color: "red" });
  }
};

const toggleSelectAll = () => {
  if (selectedJobs.value.length === jobs.value.length) {
    selectedJobs.value = [];
  } else {
    selectedJobs.value = jobs.value.map(j => j.id);
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-400 bg-green-400/10 border-green-400/20";
  if (score >= 60) return "text-blue-400 bg-blue-400/10 border-blue-400/20";
  return "text-orange-400 bg-orange-400/10 border-orange-400/20";
};

watch([page, search, selectedSource, selectedStatus], () => {
  if (page.value !== 1) page.value = 1;
  else fetchJobs();
});

watch(page, () => fetchJobs());

onMounted(() => {
  fetchStats();
  fetchJobs();
});
</script>

<template>
  <div class="p-4 lg:p-8 space-y-8">
    <!-- Header & Stats -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-white">Lowongan Rekomendasi</h1>
        <p class="text-white/60 text-sm mt-1">
          Dipilih secara otomatis berdasarkan keahlian dan profil Anda
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 focus-within:border-white/30 transition-colors h-[38px]">
          <label class="text-xs text-white/50 mr-2 whitespace-nowrap">Loker AI:</label>
          <input
            v-model="refreshLimit"
            type="number"
            min="1"
            max="100"
            class="bg-transparent border-none outline-none text-white text-sm w-12 text-center p-0 ring-0"
          />
        </div>
        <button
          @click="triggerRefresh"
          class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium border border-white/10 h-[38px]"
        >
          <Icon name="carbon:renew" size="16" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div
      v-if="!statsLoading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div class="bg-[#0f1520] border border-white/5 rounded-xl p-5">
        <div
          class="text-white/50 text-xs font-medium mb-1 uppercase tracking-wider"
        >
          Total Lowongan Scraped
        </div>
        <div class="text-3xl font-bold text-white">{{ stats.total }}</div>
        <div v-if="stats.lastScraped" class="text-xs text-white/40 mt-2">
          Update terakhir: {{ formatDate(stats.lastScraped) }}
        </div>
      </div>

      <div
        v-for="source in sources"
        :key="source"
        class="bg-[#0f1520] border border-white/5 rounded-xl p-5"
      >
        <div
          class="text-white/50 text-xs font-medium mb-1 uppercase tracking-wider"
        >
          {{ source }}
        </div>
        <div class="text-3xl font-bold text-white">
          {{ stats.bySource[source] }}
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="bg-[#0f1520] border border-white/5 rounded-xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between"
    >
      <div class="relative flex-1 w-full">
        <Icon
          name="carbon:search"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          v-model.lazy="search"
          type="text"
          placeholder="Cari posisi atau perusahaan..."
          class="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div class="flex flex-wrap gap-4 w-full lg:w-auto items-center">
        <div class="flex flex-wrap gap-2">
          <select
            v-model="selectedStatus"
            class="bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
          >
            <option value="active" class="bg-[#0f1520]">Aktif</option>
            <option value="archived" class="bg-[#0f1520]">Diarsipkan</option>
            <option value="all" class="bg-[#0f1520]">Semua</option>
          </select>
        </div>

        <div class="flex flex-wrap gap-2 border-l border-white/10 pl-4">
          <button
            @click="selectedSource = ''"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm transition-colors',
              selectedSource === ''
                ? 'bg-primary text-black font-medium'
                : 'bg-white/5 text-white/70 hover:bg-white/10',
            ]"
          >
            Semua
          </button>
          <button
            v-for="source in sources"
            :key="source"
            @click="selectedSource = source"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm transition-colors capitalize',
              selectedSource === source
                ? 'bg-primary text-black font-medium'
                : 'bg-white/5 text-white/70 hover:bg-white/10',
            ]"
          >
            {{ source }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center" v-if="jobs.length > 0 && selectedStatus !== 'archived'">
      <label class="flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white transition-colors">
        <input 
          type="checkbox" 
          class="rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-[#0f1520]"
          :checked="selectedJobs.length === jobs.length && jobs.length > 0"
          @change="toggleSelectAll"
        />
        <span>Pilih Semua Halaman Ini</span>
      </label>
      
      <button
        v-if="selectedJobs.length > 0"
        @click="archiveSelectedJobs"
        class="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
      >
        Arsipkan {{ selectedJobs.length }} Terpilih
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="bg-[#0f1520] border border-white/5 rounded-xl p-5 h-48 animate-pulse"
      >
        <div class="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-white/5 rounded w-1/2 mb-8"></div>
        <div class="flex gap-2">
          <div class="h-6 bg-white/10 rounded w-16"></div>
          <div class="h-6 bg-white/10 rounded w-16"></div>
        </div>
      </div>
    </div>

    <!-- Jobs Grid -->
    <div
      v-else-if="jobs.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="job in jobs"
        :key="job.id"
        :class="['bg-[#0f1520] border rounded-xl p-5 transition-all group flex flex-col', selectedJobs.includes(job.id) ? 'border-primary/50 bg-primary/5' : 'border-white/5 hover:border-primary/30']"
      >
        <div class="flex justify-between items-start gap-4 mb-3">
          <input 
            v-if="selectedStatus !== 'archived'"
            type="checkbox" 
            :value="job.id"
            v-model="selectedJobs"
            class="mt-1 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-[#0f1520]"
          />
          <div>
            <h3
              class="text-lg font-semibold text-white group-hover:text-primary transition-colors line-clamp-2"
              :title="job.title"
            >
              {{ job.title }}
            </h3>
            <p class="text-white/60 text-sm mt-1">{{ job.company }}</p>
          </div>
          <div
            class="px-2.5 py-1 rounded-md text-xs font-bold border flex-shrink-0 text-blue-400 bg-blue-400/10 border-blue-400/20"
          >
            Baru
          </div>
        </div>

        <div class="flex flex-wrap gap-2 my-3">
          <span
            v-if="job.location"
            class="px-2 py-1 bg-white/5 rounded text-xs text-white/70 flex items-center gap-1"
          >
            <Icon name="carbon:location" /> {{ job.location }}
          </span>
          <span
            v-if="job.salary"
            class="px-2 py-1 bg-white/5 rounded text-xs text-green-400/80 flex items-center gap-1"
          >
            <Icon name="carbon:currency" /> {{ job.salary }}
          </span>
          <span
            class="px-2 py-1 bg-white/5 rounded text-xs text-white/50 uppercase tracking-wider"
          >
            {{ job.source }}
          </span>
        </div>

        <p
          v-if="job.relevance_reason"
          class="text-xs text-white/40 line-clamp-2 mt-auto mb-4 italic"
        >
          "{{ job.relevance_reason }}"
        </p>

        <div
          class="flex justify-between items-center mt-auto pt-4 border-t border-white/5"
        >
          <span class="text-xs text-white/30">{{
            formatDate(job.posted_at || job.created_at)
          }}</span>
          <a
            :href="job.job_url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            Buka <Icon name="carbon:launch" size="14" />
          </a>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-[#0f1520] border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center"
    >
      <div
        class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20"
      >
        <Icon name="carbon:search" size="32" />
      </div>
      <h3 class="text-white font-medium mb-2">Tidak ada lowongan</h3>
      <p class="text-white/50 text-sm max-w-sm">
        Belum ada lowongan yang cocok ditemukan. Coba hapus filter atau tunggu
        hingga worker mengambil data baru.
      </p>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex justify-center items-center gap-4 mt-8"
    >
      <button
        :disabled="page === 1"
        @click="page--"
        class="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Icon name="carbon:chevron-left" size="20" />
      </button>
      <span class="text-sm text-white/60"
        >Halaman {{ page }} dari {{ totalPages }}</span
      >
      <button
        :disabled="page === totalPages"
        @click="page++"
        class="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Icon name="carbon:chevron-right" size="20" />
      </button>
    </div>
  </div>
</template>
