import { NotificationStrategy } from './notification-strategy.interface'

export class SlackNotification implements NotificationStrategy {
        constructor(private webhookUrl: string) { }

        private getHttpMessage(message: string) {
                return {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ text: message })

                }
        }

        public async send(message: string) {
                const response = await fetch(this.webhookUrl, this.getHttpMessage(message))

                if (!response.ok) {
                        throw new Error(`Failed to send Slack notification: ${response.statusText}`)
                }
        }
}
