export class SmtpConfig {
    public host = process.env.HOST;
    public user = process.env.USER;
    public pass = process.env.PASS_SMTP
}