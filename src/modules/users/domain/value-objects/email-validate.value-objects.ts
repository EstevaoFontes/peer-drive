import validator from 'validator'

export class Email{
    private readonly value: string;

    constructor(email: string){

        if(!email){
            throw new Error("O e-mail não pode ser vazio.")
        }

        const emailNormalized = email.trim().toLocaleLowerCase()

        if(!validator.isEmail(emailNormalized)){
            throw new Error('Formato de e-mail invalido.')
        }

        this.value = emailNormalized
    }

    public get getEmail(): string{
        return this.value
    }
}