import {cpf as cpfValidation} from "cpf-cnpj-validator";

export class Cpf{
    private readonly _value: string;

    constructor(cpf: string){

        if(!cpf){
            throw new Error("O CPF não pode ser vazio.");
        }

        const cleanedCpf = cpf.replace(/\D/g, "");

        if(!cpfValidation.isValid(cleanedCpf)){
            throw new Error("CPF invalido.");
        }

        this._value = cleanedCpf;
    }

    public get value(): string{
        return this._value;
    }

    public cpfFormatted(): string{
        return cpfValidation.format(this._value);
    }
}