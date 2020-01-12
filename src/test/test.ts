import {SpecBuilder, SpecEncoder, SpecDecoder, Primitives} from "../main/index";

export interface MyData {
    text: string;
    code: number;
    success: boolean;
    data: Uint8Array;
    obj: {
        zxc: number;
        list: number[];
    }
}

let spec = new SpecBuilder().object<MyData>(x => x
    .primitive("text", Primitives.STRING_UTF8)
    .primitive("code", Primitives.UINT8)
    .primitive("success", Primitives.BOOLEAN)
    .primitive("data", Primitives.DATA)
    .object("obj", x => x
        .primitive("zxc", Primitives.DOUBLE_BE)
        .sequence("list", x => x.primitive(Primitives.UINT16BE))
        .build()
    )
    .build()
);

let data: MyData = {
    text: "Hello world!",
    code: 0x12,
    success: true,
    data: new Uint8Array([1, 2, 3, 4, 5]),
    obj: {
        zxc: 5.23,
        list: [6, 7, 8]
    }
};
console.log("MyData", data);

let encoded = SpecEncoder.encode(spec, data);
console.log("Encoded", encoded);

let decoded = SpecDecoder.decode(spec, encoded);
console.log("Decoded", decoded);