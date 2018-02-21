import * as sendGrid from '@sendgrid/mail';
import { IMailSender } from '../interfaces/mail-sender';

export class SendGridMailSender implements IMailSender {

    constructor(
        private apiKey: string,
    ) {
        sendGrid.setApiKey(this.apiKey);
    }

    public async send(body: string, from: string, subject: string, to: string): Promise<void> {
        const msg = {
            from,
            html: body,
            subject,
            to,
          };

        const result: any = await sendGrid.send(msg);
    }
}
