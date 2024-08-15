import { DiscordNotification } from '../strategies';

//import dotenv from 'dotenv';

//dotenv.config({ path: '.env' });

describe('Notifications', () => {
        describe("Discord", () => {
                let WEBHOOK

                beforeAll(() => {
                        WEBHOOK = "https://discordapp.com/api/webhooks/1242218864545370132/25ivU1eGW5phEhuAIhKng7aM1IY7VISs1RVDhKRomOkrp24vrzFBS4UQoxQ9m04wrajg"
                })
                
                it('should send a Discord notification for a valid webhook', () => {
                        let notifier = new DiscordNotification(WEBHOOK)

                        return expect(notifier.send('Test message')).resolves.not.toThrow()
                })

                it('should throw if the message could not be sent', () => {
                        let notifier = new DiscordNotification("BAD_WEBHOOK")

                        return expect(notifier.send('Test message')).resolves.toThrow()

                })
        })
});

