export class User {
    public name: string = '';
    public email: string = '';
    public password: string = '';
    public birthDate: Date = new Date();
    public setPassword?: boolean;
}