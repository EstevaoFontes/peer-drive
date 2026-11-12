import { Vehicle } from "./vehicle.entity.js";
import { VehicleId } from "../value-objects/vehicle-id.value-objects.js";
import { UserId } from "../../../users/domain/value-objects/id-create.value-objects.js";
import { vehicleType } from "../enums/vehicle-types.enum.js";
import { rentalPurpose } from "../enums/rental-purpose.enum.js";

export class Car extends Vehicle {

    protected get pricingStrategies(): Partial<Record<rentalPurpose, (base: number) => number>> {
        return {
            [rentalPurpose.TOUR]: (base) => base * 1.0,
            [rentalPurpose.TRIPS]: (base) => base * 1.10,
            [rentalPurpose.DELIVERIES]: (base) => base * 1.20,
            [rentalPurpose.APP_RIDES]: (base) => base * 1.25
        };
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
            vehicleType.CAR,
            model,
            brand,
            year,
            dailyRate,
            imageUrl,
            isAvaible ?? true
        );
    }


}