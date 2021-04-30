import nodeMailer from 'nodemailer'
import { SmtpConfig } from '../config/smtpConfig'

export class EmailService {
    private async sendEmail(message: string, toEmail: string, fromEmail: string, subjectEmail: string) {
        const smtpConfig = new SmtpConfig();
        const transporter = nodeMailer.createTransport({
            host: smtpConfig.host,
            port: 465,
            secure: true,
            auth: {
                user: smtpConfig.user,
                pass: smtpConfig.pass
            }
        })
        try {
            await transporter.sendMail({ from: fromEmail, to: toEmail, subject: subjectEmail, text: message })
        } catch (e) {
            throw new Error('error to send email')
        }
    }

    public async sendNewPassword(password: string, toEmail: string) {
        const message = `sua nova senha é ${password}`
        return this.sendEmail(message, toEmail, 'suporte@swhapp.com.br', 'nova senha')
    }

    public async notifyNewPassword(email: string) {
        try {
            await this.sendEmail('sua senha foi alterada', email, 'suporte@swhapp.com.br', 'atualização de senha')
            return
        } catch (_e) {
            return
        }
    }

}