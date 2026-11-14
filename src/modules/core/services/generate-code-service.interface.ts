export interface ICodeGeneratorService {
    generate(): string | null

}

export const CODE_GENERATOR_SERVICE_TOKEN = "ICodeGeneratorService";