import { DiscordNotification } from '../strategies';
import { config } from 'dotenv';
config();

describe('Notifications', () => {
        describe("Discord", () => {
                let WEBHOOK

                beforeAll(() => {
                        WEBHOOK = process.env.DISCORD_WEBHOOK
                })

                it('should send a Discord notification for a valid webhook', () => {
                        let notifier = new DiscordNotification(WEBHOOK)

                        return expect(notifier.send('Test message')).resolves.not.toThrow()
                })

                it('should throw if the message could not be sent', () => {
                        let notifier = new DiscordNotification("BAD_WEBHOOK")

                        return expect(notifier.send('Test message')).rejects.toThrow()

                })
        })
});

