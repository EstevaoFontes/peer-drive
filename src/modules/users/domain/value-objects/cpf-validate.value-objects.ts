import {cpf as cpfValidation} from 'cpf-cnpj-validator'

export class Cpf{
    private readonly value: string;

    constructor(cpf: string){

        if(!cpf){
            throw new Error("O CPF não pode ser vazio.");
        }

        const cleanedCpf = cpf.replace(/\D/g, '');

        if(!cpfValidation.isValid(cleanedCpf)){
            throw new Error('CPF invalido.');
        }

        this.value = cleanedCpf;
    }

    public get GetCpf(): string{
        return this.value;
    }

    public get cpfFormatted(): string{
        return cpfValidation.format(this.value);
    }
}