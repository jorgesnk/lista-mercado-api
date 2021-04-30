import { JsonSchemaTypes, JsonSchemaFormat } from '../enums/jsonSchemas.enum'
export interface JsonSchemaInterface {
    type: JsonSchemaTypes,
    minLength?: number,
    maxLength?: number,
    format?: JsonSchemaFormat,
    minimum?: number,
    maximum?: number,
    enum?: string[],
    required?: string[],
    items?: JsonSchemaInterface,
    minItems?: number,
    maxItems?: number,
    uniqueItems?: boolean,
    additionalProperties?: boolean,
    properties?: { [key: string]: JsonSchemaInterface }
}