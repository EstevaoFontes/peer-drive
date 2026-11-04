import validator from 'validator'

export class Email{
    private readonly _value: string;

    constructor(email: string){

        if(!email){
            throw new Error("O e-mail não pode ser vazio.")
        }

        const emailNormalized = email.trim().toLocaleLowerCase()

        if(!validator.isEmail(emailNormalized)){
            throw new Error('Formato de e-mail invalido.')
        }

        this._value = emailNormalized
    }

    public get value(): string{
        return this._value
    }
}