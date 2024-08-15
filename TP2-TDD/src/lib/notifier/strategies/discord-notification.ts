import { NotificationStrategy } from './notification-strategy.interface'

export class DiscordNotification implements NotificationStrategy {
        constructor(private webhookUrl: string) { }

        private getHttpMessage(message: string) {
                return {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ content: message })

                }
        }

        public async send(message: string) {
                const response = await fetch(this.webhookUrl, this.getHttpMessage(message))

                if (!response.ok) {
                        throw new Error(`Failed to send Discord notification: ${response.statusText}`)
                }
        }
}
