import {BufferStream} from "buffer-stream-js";
import {StringEncoding, Primitives, Spec, Map} from "./Types";
import {Uint8ArrayUtils} from "uint8array-utils";

export class SpecEncoder {
    
    constructor(public stream: BufferStream) {
    }
    
    static encode<T = any>(spec: Spec<T>, data: T, length?: number): Uint8Array {
        let encoder = SpecEncoder.alloc(length || 1024);
        encoder.encode(spec, data);
        return encoder.getBuffer();
    }
    
    static alloc(length: number): SpecEncoder {
        return new SpecEncoder(BufferStream.alloc(length));
    }
    
    getBuffer() {
        return this.stream.getLeftBuffer();
    }
    
    encode<T = any>(spec: Spec<T>, data: T): void {
        return this.encodeCore(spec, spec.converter ? spec.converter.encode(data) : data);
    }
    
    private encodeCore<T = any>(spec: Spec<T>, data: T): void {
        if (spec.type == Primitives.INT) {
            return this.encodeInt(<number><any>data);
        }
        if (spec.type == Primitives.INT8) {
            return this.encodeInt8(<number><any>data);
        }
        if (spec.type == Primitives.INT16LE) {
            return this.encodeInt16LE(<number><any>data);
        }
        if (spec.type == Primitives.INT16BE) {
            return this.encodeInt16BE(<number><any>data);
        }
        if (spec.type == Primitives.INT32LE) {
            return this.encodeInt32LE(<number><any>data);
        }
        if (spec.type == Primitives.INT32BE) {
            return this.encodeInt32BE(<number><any>data);
        }
        if (spec.type == Primitives.UINT) {
            return this.encodeUInt(<number><any>data);
        }
        if (spec.type == Primitives.UINT8) {
            return this.encodeUInt8(<number><any>data);
        }
        if (spec.type == Primitives.UINT16LE) {
            return this.encodeUInt16LE(<number><any>data);
        }
        if (spec.type == Primitives.UINT16BE) {
            return this.encodeUInt16BE(<number><any>data);
        }
        if (spec.type == Primitives.UINT32LE) {
            return this.encodeUInt32LE(<number><any>data);
        }
        if (spec.type == Primitives.UINT32BE) {
            return this.encodeUInt32BE(<number><any>data);
        }
        if (spec.type == Primitives.FLOAT_LE) {
            return this.encodeFloatLE(<number><any>data);
        }
        if (spec.type == Primitives.FLOAT_BE) {
            return this.encodeFloatBE(<number><any>data);
        }
        if (spec.type == Primitives.DOUBLE_LE) {
            return this.encodeDoubleLE(<number><any>data);
        }
        if (spec.type == Primitives.DOUBLE_BE) {
            return this.encodeDoubleBE(<number><any>data);
        }
        if (spec.type == Primitives.BOOLEAN) {
            return this.encodeBoolean(<boolean><any>data);
        }
        if (spec.type == Primitives.DATA) {
            return this.encodeData(<Uint8Array><any>data, spec.length);
        }
        if (spec.type == Primitives.STRING) {
            return this.encodeString(<string><any>data, spec.length);
        }
        if (spec.type == Primitives.STRING_UTF8) {
            return this.encodeStringUtf8(<string><any>data, spec.length);
        }
        if (spec.type == Primitives.SEQUENCE) {
            return this.encodeSequence(<Spec>spec.spec, <any[]><any>data, spec.length);
        }
        if (spec.type == Primitives.OBJECT) {
            return this.encodeObject(<Map<Spec>>spec.spec, <Map<any>><any>data);
        }
        throw new Error("Unsupported spec type");
    }
    
    encodeInt(data: number): void {
        this.stream.writeInt(data);
    }
    
    encodeInt8(data: number): void {
        this.stream.writeInt8(data);
    }
    
    encodeInt16LE(data: number): void {
        this.stream.writeInt16LE(data);
    }
    
    encodeInt16BE(data: number): void {
        this.stream.writeInt16BE(data);
    }
    
    encodeInt32LE(data: number): void {
        this.stream.writeInt32LE(data);
    }
    
    encodeInt32BE(data: number): void {
        this.stream.writeInt32BE(data);
    }
    
    encodeUInt(data: number): void {
        this.stream.writeUInt(data);
    }
    
    encodeUInt8(data: number): void {
        this.stream.writeUInt8(data);
    }
    
    encodeUInt16LE(data: number): void {
        this.stream.writeUInt16LE(data);
    }
    
    encodeUInt16BE(data: number): void {
        this.stream.writeUInt16BE(data);
    }
    
    encodeUInt32LE(data: number): void {
        this.stream.writeUInt32LE(data);
    }
    
    encodeUInt32BE(data: number): void {
        this.stream.writeUInt32BE(data);
    }
    
    encodeFloatLE(data: number): void {
        this.stream.writeFloatLE(data);
    }
    
    encodeFloatBE(data: number): void {
        this.stream.writeFloatBE(data);
    }
    
    encodeDoubleLE(data: number): void {
        this.stream.writeDoubleLE(data);
    }
    
    encodeDoubleBE(data: number): void {
        this.stream.writeDoubleBE(data);
    }
    
    encodeBoolean(data: boolean): void {
        this.stream.writeUInt8(data ? 1 : 0);
    }
    
    encodeData(data: ArrayBuffer|ArrayBufferView|number[], length?: number): void {
        let buffer = Uint8ArrayUtils.arrayLike(data);
        if (length == null) {
            this.encodeUInt(buffer.length);
        }
        else if (buffer.length != length) {
            throw new Error("Invalid data length");
        }
        this.stream.write(buffer);
    }
    
    encodeString(data: string, encoding: StringEncoding, length?: number): void {
        if (typeof(data) != "string") {
            throw new Error("Invalid data");
        }
        if (encoding != StringEncoding.UTF8) {
            throw new Error("Unsupported string encoding");
        }
        this.stream.writeUInt8(encoding);
        let buffer = BufferStream.writeUtf8String(data);
        if (length == null) {
            this.encodeUInt(buffer.length);
        }
        else if (buffer.length != length) {
            throw new Error("Invalid data length");
        }
        this.stream.write(buffer);
    }
    
    encodeStringUtf8(data: string, length?: number): void {
        if (typeof(data) != "string") {
            throw new Error("Invalid data");
        }
        let buffer = BufferStream.writeUtf8String(data);
        if (length == null) {
            this.encodeUInt(buffer.length);
        }
        else if (buffer.length != length) {
            throw new Error("Invalid data length");
        }
        this.stream.write(buffer);
    }
    
    encodeSequence<T = any>(spec: Spec<T>, data: T[], length?: number): void {
        if (!Array.isArray(data)) {
            throw new Error("Invalid data");
        }
        if (length == null) {
            this.encodeUInt(data.length);
        }
        else if (data.length != length) {
            throw new Error("Invalid data length");
        }
        data.forEach(x => {
            this.encode(spec, x);
        });
    }
    
    encodeObject<T extends Map<any>>(spec: Map<Spec>, data: T): void {
        if (typeof(data) != "object" || data == null) {
            throw new Error("Invalid data");
        }
        for (let name in spec) {
            this.encode(spec[name], data[name]);
        }
    }
}
