import { describe, it, expect } from "vitest";
import { Car } from "./car.entity.js";
import { UserId } from "../../../users/domain/value-objects/id-create.value-objects.js";
import { VehicleId } from "../value-objects/vehicle-id.value-objects.js";
import { rentalPurpose } from "../enums/rental-purpose.enum.js";

describe("Car entity", () => {

    const car = new Car(
        new VehicleId("123a"),
        new UserId("1234b"),
        "Argo",
        "Fiat",
        "2019",
        130,
        ["imagem1.jpg"]
    );

    describe("Main calculation", () => {
        it.each([
            { purpose: rentalPurpose.TOUR, expectedCost: 130.00 },
            { purpose: rentalPurpose.TRIPS, expectedCost: 143.00 },
            { purpose: rentalPurpose.DELIVERIES, expectedCost: 156.00 },
            { purpose: rentalPurpose.APP_RIDES, expectedCost: 162.50 }
        ])("should calculate the cost according to the purpose.", ({ purpose, expectedCost }) => {
            const cost = car.calculateCostByTypeUse(purpose);
            expect(cost).toBeCloseTo(expectedCost, 2);
        });
    });

    describe("Validations and Errors", () => {
        it("should throw an error when the vehicle type is not supported", () => {
            expect(() => {
                car.calculateCostByTypeUse(rentalPurpose.FREIGHT);
            }).toThrow("Esse veículo não aceita esse tipo de uso.");
        });
    });
});