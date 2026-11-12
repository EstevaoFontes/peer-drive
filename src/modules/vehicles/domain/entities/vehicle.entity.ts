import { VehicleId } from "../value-objects/vehicle-id.value-objects.js";
import { UserId } from "../../../users/domain/value-objects/id-create.value-objects.js";
import { vehicleType } from "../enums/vehicle-types.enum.js";
import { rentalPurpose } from "../enums/rental-purpose.enum.js";


export abstract class Vehicle {

    protected abstract get pricingStrategies(): Partial<Record<rentalPurpose, (base: number) => number >>;

    constructor(
        public readonly id: VehicleId | undefined,
        public readonly ownerId: UserId,
        public type: vehicleType,
        public model: string,
        public brand: string,
        public year: string,
        public dailyRate: number,
        public imageUrl: string[],
        public isAvailable: boolean = true  
    ) {
        if (!ownerId) {
            throw new Error('Erro ao cadastrar o carro.');
        }

        if (!type) {
            throw new Error('É obrigatório enviar o tipo do veículo.');
        }

        if (!Object.values(vehicleType).includes(type)) {
            throw new Error(`O tipo de Veículo (${type}) não é válido.`);
        }

        if (!model) {
            throw new Error('É obrigatório o Modelo.');
        }

        if (!brand) {
            throw new Error('É obrigatório a Marca.');
        }

        if (!dailyRate) {
            throw new Error('É obrigatório enviar um valor do carro.');
        }

        if (imageUrl.length < 1) {
            throw new Error('Tem que enviar pelo menos 1 imagem.');
        }

        if (imageUrl.length > 4) {
            throw new Error('Não é permitido mais que 4 imagens.');
        }

        if (!year) {
            throw new Error('É obrigatório o ano.');
        }

    }


    public rent(): void {
        if (!this.isAvailable) {
            throw new Error("Esse veículo já está alugado.")
        }

        this.isAvailable = false
    };
    

    public returnVehicle(): void {
        if (this.isAvailable) {
            throw new Error('Este Veículo já está disponível.')
        }

        this.isAvailable = true
    };


    public calculateCostByTypeUse(typeUse: rentalPurpose): number{

        const getStrategy = this.pricingStrategies[typeUse]

        if(!getStrategy){
            throw new Error("Esse veículo não aceita esse tipo de uso.");
        }

        return getStrategy(this.dailyRate)

    };

}