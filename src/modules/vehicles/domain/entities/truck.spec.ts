import { describe, it, expect } from "vitest";
import { Truck } from "./truck.entity.js";
import { UserId } from "../../../users/domain/value-objects/id-create.value-objects.js";
import { VehicleId } from "../value-objects/vehicle-id.value-objects.js";
import { rentalPurpose } from "../enums/rental-purpose.enum.js";

describe("Truck entity", () => {

    const truck = new Truck(
        new VehicleId("123a"),
        new UserId("1234b"),
        "Scania",
        "Traton",
        "2012",
        210,
        ["imagem1.jpg"]
    );

    describe("Main calculation", () => {
        it.each([
            {purpose: rentalPurpose.FREIGHT, expectedCost: 210.00},
            {purpose: rentalPurpose.CONSTRUCTION, expectedCost: 273.00},
        ])("should calculate the cost according to the purpose.", ({purpose, expectedCost}) => {
            const cost = truck.calculateCostByTypeUse(purpose);
            expect(cost).toBeCloseTo(expectedCost, 2);
        });
    });

    describe("Validations and Errors", () => {
        it("should throw an error when the vehicle type is not supported", () => {
            expect(() => {
                truck.calculateCostByTypeUse(rentalPurpose.APP_RIDES);
            }).toThrow("Esse veículo não aceita esse tipo de uso.");
        });
    });
});