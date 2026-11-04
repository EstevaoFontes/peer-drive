import { describe, it, expect } from "vitest";
import { PickupTruck } from "./pickupTruck.entity.js";
import { UserId } from "../../users/domain/value-objects/id-create.value-objects.js";
import { VehicleId } from "./value-objects/vehicle-id.value-objects.js";
import { rentalPurpose } from "./enums/rental-purpose.enum.js";

describe('Pickup Truck entity', () => {

    const pickupTruck = new PickupTruck(
        new VehicleId("123a"),
        new UserId('1234b'),
        "Ranger",
        "Ford",
        "2026",
        190,
        ["imagem1.jpg"]
    )

    describe('Main calculation', () => {
        it.each([
            { purpose: rentalPurpose.TRIPS, expectedCost: 218.50 },
            { purpose: rentalPurpose.DELIVERIES, expectedCost: 228.00 },
            { purpose: rentalPurpose.FREIGHT, expectedCost: 237.50 },
            { purpose: rentalPurpose.CONSTRUCTION, expectedCost: 247.00 }
        ])("should calculate the cost according to the purpose.", ({ purpose, expectedCost }) => {
            const cost = pickupTruck.calculateCostByTypeUse(purpose);
            expect(cost).toBeCloseTo(expectedCost, 2);
        })
    })

    describe('Validations and Errors', () => {
        it('should throw an error when the vehicle type is not supported', () => {
            expect(() => {
                pickupTruck.calculateCostByTypeUse(rentalPurpose.TOUR);
            }).toThrow("Esse veículo não aceita esse tipo de uso.")
        })
    })
})