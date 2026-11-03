import { Vehicle } from "./vehicle.entity.js";
import { VehicleId } from "./value-objects/id-create.value-objects.js";
import { UserId } from "../../users/domain/value-objects/id-create.value-objects.js";
import { rentalPurpose } from "./enums/rental-purposE.enum.js";
import { vehicleType } from "./enums/vehicle-types.enum.js";

export class Truck extends Vehicle {

    protected get pricingStrategies(): Partial<Record<rentalPurpose, (base: number) => number>> {
        return {
            [rentalPurpose.FREIGHT]: (base) => base * 1.0,
            [rentalPurpose.CONSTRUCTION]: (base) => base * 1.30
        }
    }


    constructor(
        id: VehicleId | undefined,
        ownerId: UserId,
        model: string,
        brand: string,
        year: string,
        dailyRate: number,
        imageUrl: string[],
        isAvaible?: boolean
    ) {
        super(
            id,
            ownerId,
            vehicleType.MOTORCYCLE,
            model,
            brand,
            year,
            dailyRate,
            imageUrl,
            isAvaible ?? true
        )
    }

}