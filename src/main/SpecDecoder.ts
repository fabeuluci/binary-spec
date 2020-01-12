import {BufferStream} from "buffer-stream-js";
import {StringEncoding, Primitives, Spec, Map} from "./Types";

export class SpecDecoder {
    
    constructor(public stream: BufferStream) {
    }
    
    static decode<T = any>(spec: Spec<T>, data: ArrayBuffer|ArrayBufferView): T {
        return new SpecDecoder(new BufferStream(data)).decode<T>(spec);
    }
    
    static create(data: ArrayBuffer|ArrayBufferView) {
        return new SpecDecoder(new BufferStream(data));
    }
    
    decode<T = any>(spec: Spec<T>): T {
        let value = this.decodeCore(spec);
        return spec.converter ? spec.converter.decode(value) : value;
    }
    
    private decodeCore<T = any>(spec: Spec<T>): T {
        if (spec.type == Primitives.INT) {
            return <T><any>this.decodeInt();
        }
        if (spec.type == Primitives.INT8) {
            return <T><any>this.decodeInt8();
        }
        if (spec.type == Primitives.INT16LE) {
            return <T><any>this.decodeInt16LE();
        }
        if (spec.type == Primitives.INT16BE) {
            return <T><any>this.decodeInt16BE();
        }
        if (spec.type == Primitives.INT32LE) {
            return <T><any>this.decodeInt32LE();
        }
        if (spec.type == Primitives.INT32BE) {
            return <T><any>this.decodeInt32BE();
        }
        if (spec.type == Primitives.UINT) {
            return <T><any>this.decodeUInt();
        }
        if (spec.type == Primitives.UINT8) {
            return <T><any>this.decodeUInt8();
        }
        if (spec.type == Primitives.UINT16LE) {
            return <T><any>this.decodeUInt16LE();
        }
        if (spec.type == Primitives.UINT16BE) {
            return <T><any>this.decodeUInt16BE();
        }
        if (spec.type == Primitives.UINT32LE) {
            return <T><any>this.decodeUInt32LE();
        }
        if (spec.type == Primitives.UINT32BE) {
            return <T><any>this.decodeUInt32BE();
        }
        if (spec.type == Primitives.FLOAT_LE) {
            return <T><any>this.decodeFloatLE();
        }
        if (spec.type == Primitives.FLOAT_BE) {
            return <T><any>this.decodeFloatBE();
        }
        if (spec.type == Primitives.DOUBLE_LE) {
            return <T><any>this.decodeDoubleLE();
        }
        if (spec.type == Primitives.DOUBLE_BE) {
            return <T><any>this.decodeDoubleBE();
        }
        if (spec.type == Primitives.BOOLEAN) {
            return <T><any>this.decodeBoolean();
        }
        if (spec.type == Primitives.DATA) {
            return <T><any>this.decodeData(spec.length);
        }
        if (spec.type == Primitives.STRING) {
            return <T><any>this.decodeString(spec.length);
        }
        if (spec.type == Primitives.STRING_UTF8) {
            return <T><any>this.decodeStringUtf8(spec.length);
        }
        if (spec.type == Primitives.SEQUENCE) {
            return <T><any>this.decodeSequence(<Spec>spec.spec, spec.length);
        }
        if (spec.type == Primitives.OBJECT) {
            return <T><any>this.decodeObject(<Map<Spec>>spec.spec);
        }
        throw new Error("Unsupported spec type");
    }
    
    decodeInt(): number {
        return this.stream.readInt();
    }
    
    decodeInt8(): number {
        return this.stream.readInt8();
    }
    
    decodeInt16LE(): number {
        return this.stream.readInt16LE();
    }
    
    decodeInt16BE(): number {
        return this.stream.readInt16BE();
    }
    
    decodeInt32LE(): number {
        return this.stream.readInt32LE();
    }
    
    decodeInt32BE(): number {
        return this.stream.readInt32BE();
    }
    
    decodeUInt(): number {
        return this.stream.readUInt();
    }
    
    decodeUInt8(): number {
        return this.stream.readUInt8();
    }
    
    decodeUInt16LE(): number {
        return this.stream.readUInt16LE();
    }
    
    decodeUInt16BE(): number {
        return this.stream.readUInt16BE();
    }
    
    decodeUInt32LE(): number {
        return this.stream.readUInt32LE();
    }
    
    decodeUInt32BE(): number {
        return this.stream.readUInt32BE();
    }
    
    decodeFloatLE(): number {
        return this.stream.readFloatLE();
    }
    
    decodeFloatBE(): number {
        return this.stream.readFloatBE();
    }
    
    decodeDoubleLE(): number {
        return this.stream.readDoubleLE();
    }
    
    decodeDoubleBE(): number {
        return this.stream.readDoubleBE();
    }
    
    decodeBoolean(): boolean {
        return this.stream.readUInt8() != 0;
    }
    
    decodeData(length?: number): Uint8Array {
        if (length == null) {
            length = this.decodeUInt();
        }
        return this.stream.read(length);
    }
    
    decodeString(length?: number): string {
        let encoding = <StringEncoding>this.decodeUInt8();
        if (encoding != StringEncoding.UTF8) {
            throw new Error("Unsupported string encoding");
        }
        if (length == null) {
            length = this.decodeUInt();
        }
        return this.stream.readUtf8String(length);
    }
    
    decodeStringUtf8(length?: number): string {
        if (length == null) {
            length = this.decodeUInt();
        }
        return this.stream.readUtf8String(length);
    }
    
    decodeSequence<T = any>(spec: Spec<T[]>, length?: number): T[] {
        if (length == null) {
            length = this.decodeUInt();
        }
        let res: T[] = [];
        for (let i = 0; i < length; i++) {
            res.push(this.decode<T>(spec));
        }
        return res;
    }
    
    decodeObject<T = any>(spec: Map<Spec>): T {
        let res: {[name: string]: any} = {};
        for (let name in spec) {
            res[name] = this.decode(spec[name]);
        }
        return <T><any>res;
    }
}
