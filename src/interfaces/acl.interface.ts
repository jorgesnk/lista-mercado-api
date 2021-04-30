import { ACLLevel } from '../enums/aclLevel.enum'
export interface ACLInterface {
    _id: string,
    level: ACLLevel
}