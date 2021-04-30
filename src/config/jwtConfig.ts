export class JWTConfig {
    public secret = process.env.JWT || 'secret';
    public algorithm = 'HS256'
}