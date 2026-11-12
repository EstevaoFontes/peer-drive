import { randomUUID } from "node:crypto";

export abstract class UniqueEntityId {

    protected readonly _value: string;

    constructor(id?: string){
        this._value = id ?? randomUUID();
    }

    public get value(): string{
        return this._value;
    }

    public equals(id?: UniqueEntityId): boolean {
        if(id === null || id === undefined){
            return false;
        }

        if (id.constructor !== this.constructor) {
            return false;
        }
        
        return this._value === id.value;
    }

}   