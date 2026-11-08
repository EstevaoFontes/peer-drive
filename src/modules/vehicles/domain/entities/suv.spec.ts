import { describe, it, expect } from "vitest";
import { Suv } from "./suv.entity.js";
import { UserId } from "../../../users/domain/value-objects/id-create.value-objects.js";
import { VehicleId } from "../value-objects/vehicle-id.value-objects.js";
import { rentalPurpose } from "../enums/rental-purpose.enum.js";

describe('SUV entity', () => {

    const suv = new Suv(
        new VehicleId("123a"),
        new UserId('1234b'),
        "Compass",
        "Jeep",
        "2015",
        180,
        ["imagem1.jpg"]
    )

    describe('Main calculation', () => {
        it.each([
            {purpose: rentalPurpose.TOUR, expectedCost: 180.00},
            {purpose: rentalPurpose.TRIPS, expectedCost: 207.00},
            {purpose: rentalPurpose.APP_RIDES, expectedCost: 243.00}
        ])("should calculate the cost according to the purpose.", ({purpose, expectedCost}) => {
            const cost = suv.calculateCostByTypeUse(purpose);
            expect(cost).toBeCloseTo(expectedCost, 2);
        })
    })

    describe('Validations and Errors', () => {
        it('should throw an error when the vehicle type is not supported', () => {
            expect(() => {
                suv.calculateCostByTypeUse(rentalPurpose.CONSTRUCTION);
            }).toThrow("Esse veículo não aceita esse tipo de uso.")
        })
    })
})