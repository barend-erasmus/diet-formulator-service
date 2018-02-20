export interface IMailSender {
    send(body: string, from: string, subject: string, to: string): Promise<void>;
}
