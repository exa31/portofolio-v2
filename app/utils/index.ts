export const hexToRgba = (hex: string, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// ISO string to readable date format (e.g., "January 10, 2026")
// Properly handles UTC timezone without shifting date
export const formatDate = (isoString: string): string => {
    if (!isoString) return 'N/A'
    try {
        // Extract just the date part to avoid timezone conversion
        const dateOnly = isoString.split('T')[0]
        const [year, month, day] = dateOnly.split('-').map(Number)

        const date = new Date(year, month - 1, day)
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
        return date.toLocaleDateString('en-US', options)
    } catch {
        return isoString
    }
}

// ISO string to YYYY-MM-DD format for input[type="date"]
// Handles timezone offset to prevent date shift
export const parseDateForInput = (isoString: string | undefined): string => {
    if (!isoString) return ''
    try {
        // Parse ISO string and extract just the date part to avoid timezone issues
        const dateOnly = isoString.split('T')[0]
        return dateOnly
    } catch {
        return ''
    }
}