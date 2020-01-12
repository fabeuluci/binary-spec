import {ObjectSpecBuilder} from "./ObjectSpecBuilder";
import {Primitives, Spec, Converter} from "./Types";

export class SpecBuilder {
    
    primitive<T = any>(type: Primitives, fixedLength?: number, converter?: Converter): Spec<T> {
        let spec: Spec<T> = {
            type: type
        };
        if (fixedLength != null) {
            spec.length = fixedLength;
        }
        if (converter != null) {
            spec.converter = converter;
        }
        return spec;
    }
    
    object<T = any>(func: (builder: ObjectSpecBuilder) => Spec): Spec<T> {
        return func(new ObjectSpecBuilder());
    }
    
    sequence<T = any>(func: (builder: SpecBuilder) => Spec, fixedLength?: number, converter?: Converter): Spec<T[]> {
        let builder = new SpecBuilder();
        let spec: Spec<T> = {
            type: Primitives.SEQUENCE,
            spec: func(builder)
        };
        if (fixedLength != null) {
            spec.length = fixedLength;
        }
        if (converter != null) {
            spec.converter = converter;
        }
        return spec;
    }
}
