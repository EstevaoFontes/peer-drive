export interface ICodeGeneratorService {
    generate(): string

}

export const CODE_GENERATOR_SERVICE_TOKEN = Symbol("ICodeGeneratorService");