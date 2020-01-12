import {SpecBuilder} from "./SpecBuilder";
import {Primitives, Spec, Converter} from "./Types";

export class ObjectSpecBuilder {
    
    spec: {[name: string]: Spec};
    builder: SpecBuilder;
    
    constructor() {
        this.spec = {};
        this.builder = new SpecBuilder();
    }
    
    primitive(name: string, type: Primitives, fixedLength?: number, converter?: Converter): ObjectSpecBuilder {
        this.spec[name] = this.builder.primitive(type, fixedLength, converter);
        return this;
    }
    
    object(name: string, func: (builder: ObjectSpecBuilder) => Spec): ObjectSpecBuilder {
        this.spec[name] = this.builder.object(func);
        return this;
    }
    
    sequence(name: string, func: (builder: SpecBuilder) => Spec, fixedLength?: number, converter?: Converter): ObjectSpecBuilder {
        this.spec[name] = this.builder.sequence(func, fixedLength, converter);
        return this;
    }
    
    build<T = any>(converter?: Converter): Spec<T> {
        let spec: Spec<T> = {
            type: Primitives.OBJECT,
            spec: this.spec
        };
        if (converter != null) {
            spec.converter = converter;
        }
        return spec;
    }
}
