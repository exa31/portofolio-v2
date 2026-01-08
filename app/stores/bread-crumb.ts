export const useBreadCrumbStore = defineStore('bread-crumb', () => {
    const listBreadCrumbs = ref<Array<{ title: string; link?: string }>>([])

    function setBreadCrumb(breadcrumbs: Array<{ title: string; link?: string }>) {
        listBreadCrumbs.value = [
            {
                title: 'Dashboard',
                link: '/dashboard',
            },
            ...breadcrumbs
        ]
    }

    return {
        listBreadCrumbs,
        setBreadCrumb,
    }
})
