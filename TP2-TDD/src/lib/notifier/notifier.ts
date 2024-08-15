import { DiscordNotification, NotificationStrategy } from './strategies'

export class Notifier {
        private strategies: NotificationStrategy[] = [];

        public constructor(webhookUrl: string) {
                this.addStrategy(new DiscordNotification(webhookUrl));
        }

        public addStrategy(strategy: NotificationStrategy) {
                this.strategies.push(strategy);
        }

        public removeStrategy(strategy: NotificationStrategy) {
                const index = this.strategies.indexOf(strategy);
                if (index !== -1) {
                        this.strategies.splice(index, 1);
                }
        }

        public async sendNotification(message: string) {
                const promises = this.strategies.map((strategy) => strategy.send(message));
                await Promise.all(promises);
        }
}
