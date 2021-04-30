import { ACLInterface } from '../interfaces/acl.interface'
export class House {
    name: string = '';
    users: ACLInterface[] = [];
    marketList: string[] = [];
}

export interface teste {
    name: string,
}