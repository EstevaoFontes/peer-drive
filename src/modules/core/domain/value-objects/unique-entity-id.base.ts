import { randomUUID } from "node:crypto";

export abstract class UniqueEntityId{
    protected readonly value: string

    constructor(id?: string){
        this.value = id ?? randomUUID();
    }

    public getValue(): string{
        return this.value;
    }

    public equals(id?: UniqueEntityId): boolean {
        if(id === null || id === undefined){
            return false;
        }

        if (id.constructor !== this.constructor) {
            return false;
        }
        
        return this.value === id.getValue();
    }
}   