/**
 * useDebounce composable
 *
 * Small utility that provides a keyed debounce helper. Each `key` represents
 * an independent debounce timer. Calling `debounce(key, fn, wait, ...args)`
 * will postpone `fn(...args)` until `wait` ms have elapsed since the last
 * call using the same `key`.
 *
 * Returned API:
 * - debounce(key, func, wait, ...args): schedule the function call
 * - cancel(key): cancel the pending timeout for `key` (if any)
 * - clearAll(): cancel all pending timeouts
 *
 * Examples:
 *
 * 1) Vue 3 - debounced search (Composition API)
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { useDebounce } from '~/composables/useDebounce'
 *
 * const { debounce } = useDebounce()
 * const q = ref('')
 * const onSearch = async (value: string) => {
 *   // perform API call with value
 *   console.log('search for', value)
 * }
 *
 * const onInput = () => {
 *   // key 'search' ensures only one timer for search input
 *   debounce('search', onSearch, 400, q.value)
 * }
 * </script>
 * ```
 *
 * 2) Multiple independent debounces (different keys)
 * ```js
 * const { debounce } = useDebounce()
 * debounce('left-pane', doHeavyCalc, 200)
 * debounce('right-pane', doOtherCalc, 300)
 *```
 *
 * 3) Plain JS usage and cancel
 * ```js
 * const { debounce, cancel } = useDebounce()
 * debounce('save', () => saveDraft(), 1000)
 * // if user navigates away before 1s, cancel pending save
 * cancel('save')
 *```
 *
 * Notes:
 * - If you call `debounce` again with the same key before the wait elapses,
 *   the previous scheduled call is cancelled automatically.
 * - `func` may be async; debounce does not await the returned Promise.
 */
export const useDebounce = () => {
    const timeoutIds = new Map<string | number, ReturnType<typeof setTimeout>>()

    /**
     * Schedule a debounced call for `func(...args)` identified by `key`.
     *
     * @param {(string|number)} key - Unique key for this debounce timer
     * @param {(...args:any[])=>void} func - Function to call after delay
     * @param {number} wait - Milliseconds to wait after the last call
     * @param {...any} args - Arguments forwarded to `func` when invoked
     */
    const debounce = (
        key: string | number,
        func: (...args: any[]) => void,
        wait: number,
        ...args: any[]
    ) => {
        if (timeoutIds.has(key)) {
            clearTimeout(timeoutIds.get(key))
        }

        const timeoutId = setTimeout(() => {
            try {
                func(...args)
            } finally {
                timeoutIds.delete(key)
            }
        }, wait)

        timeoutIds.set(key, timeoutId)
    }

    /**
     * Cancel a pending debounce for a given key.
     * @param {(string|number)} key
     */
    const cancel = (key: string | number) => {
        if (!timeoutIds.has(key)) return
        const id = timeoutIds.get(key)
        clearTimeout(id)
        timeoutIds.delete(key)
    }

    /**
     * Cancel all pending debounced calls.
     */
    const clearAll = () => {
        for (const id of timeoutIds.values()) {
            clearTimeout(id)
        }
        timeoutIds.clear()
    }

    return {
        debounce,
        cancel,
        clearAll,
    }
}