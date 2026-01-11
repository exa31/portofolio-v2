declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string
                        callback?: (response: any) => void
                        ux_mode?: 'popup' | 'redirect'
                        auto_select?: boolean
                        itp_support?: boolean
                        context?: 'signin' | 'signup' | 'use'
                    }) => void
                    renderButton: (
                        element: HTMLElement,
                        options?: {
                            theme?: 'outline' | 'filled_blue' | 'filled_black'
                            size?: 'large' | 'medium' | 'small'
                            text?: 'signin_with' | 'signup_with' | 'signin'
                            shape?: 'rectangular' | 'pill' | 'circle' | 'square'
                            logo_alignment?: 'left' | 'center'
                            width?: string
                            locale?: string
                        }
                    ) => void
                    prompt: (
                        notificationCallback?: (notification: {
                            isNotDisplayed: () => boolean
                            isSkippedMoment: () => boolean
                        }) => void
                    ) => void
                    promptAsync: () => Promise<any>
                    disableAutoSelect: () => void
                }
                oauth2: {
                    initCodeClient: (config: any) => any
                    initTokenClient: (config: any) => any
                }
            }
        }
    }
}

export {}

