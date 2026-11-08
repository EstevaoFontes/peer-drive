import { describe, it, expect } from "vitest";
import { Motorcycle } from "./motorcycle.entity.js";
import { UserId } from "../../../users/domain/value-objects/id-create.value-objects.js";
import { VehicleId } from "../value-objects/vehicle-id.value-objects.js";
import { rentalPurpose } from "../enums/rental-purpose.enum.js";

describe('Motorcycle entity', () => {

    const motorcycle = new Motorcycle(
        new VehicleId("123a"),
        new UserId('1234b'),
        "CG 160",
        "Honda",
        "2020",
        60,
        ["imagem1.jpg"]
    )

    describe('Main calculation', () => {
        it.each([
            {purpose: rentalPurpose.TOUR, expectedCost: 60.00},
            {purpose: rentalPurpose.TRIPS, expectedCost: 66.00},
            {purpose: rentalPurpose.DELIVERIES, expectedCost: 69.00},
            {purpose: rentalPurpose.APP_RIDES, expectedCost: 72.00}
        ])("should calculate the cost according to the purpose.", ({purpose, expectedCost}) => {
            const cost = motorcycle.calculateCostByTypeUse(purpose);
            expect(cost).toBeCloseTo(expectedCost, 2);
        })
    })

    describe('Validations and Errors', () => {
        it('should throw an error when the vehicle type is not supported', () => {
            expect(() => {
                motorcycle.calculateCostByTypeUse(rentalPurpose.FREIGHT);
            }).toThrow("Esse veículo não aceita esse tipo de uso.")
        })
    })
})