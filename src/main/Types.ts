export enum StringEncoding {
    UTF8
}

export enum Primitives {
    INT, //Variable size signed integer
    INT8,
    INT16BE,
    INT16LE,
    INT32LE,
    INT32BE,
    UINT, //Variable size unsigned integer
    UINT8,
    UINT16BE,
    UINT16LE,
    UINT32LE,
    UINT32BE,
    FLOAT_BE,
    FLOAT_LE,
    DOUBLE_BE,
    DOUBLE_LE,
    BOOLEAN,
    DATA, //UInt length then data
    STRING_UTF8, //UInt length then data
    STRING, //Uint8-enum string encoding, then UInt length and data
    OBJECT, //In spec ordered list of fields
    SEQUENCE //Uint length, into spec type of elements
}

export interface Converter<T = any, U = any> {
    encode(value: T): U;
    decode(value: U): T;
}

export interface Spec<T = any> {
    type: Primitives;
    length?: number;
    spec?: Spec|Map<Spec>;
    converter?: Converter;
}

export type Map<T> = {[name: string]: T};
