export interface NotificationStrategy {
    send(message: string): Promise<void>
}
