import { describe, it, expect } from "vitest";
import { DriveLicenseCategory } from "../enums/driver-license-category.enum.js";
import { DriverLicense } from "./drive-license.value-objects.js";
import { UserId } from "./id-create.value-objects.js";

describe("Test Drive License object value", () => {

    const driveLicenseData = {
        userId: new UserId(),
        registration: "123456789",
        category: DriveLicenseCategory.AB,
        firstLicenseDate: new Date(2020, 10, 2),
        expirationDate: new Date(2026, 10, 11)
    };

    it("Should create a new drive license.", () => {

        const driveLicense = DriverLicense.create(driveLicenseData);

        expect(driveLicense).toBeInstanceOf(DriverLicense);
        expect(driveLicense.userId).toBeInstanceOf(UserId);
        expect(driveLicense.category).toBe(DriveLicenseCategory.AB);
        expect(driveLicense.firstLicenseDate).toBeInstanceOf(Date);
        expect(driveLicense.expirationDate).toBeInstanceOf(Date);

        expect(driveLicense.registration).toBe("123456789");
        expect(driveLicense.category).toBe("AB");
    });

    describe("Test error in cration Driver License", () => {

        it.each([
            {
                testCase: "Should throw error if user id has empty.",
                userId: null as unknown as UserId,
                registration: "123456789",
                category: DriveLicenseCategory.AB,
                firstLicenseDate: new Date(2020, 10, 2),
                expirationDate: new Date(2026, 10, 11),
                expectedError: "Erro ao criar a Carteira de Habilitação."
            },
            {
                testCase: "Should throw error if registration has empty.",
                userId: new UserId(),
                registration: "",
                category: DriveLicenseCategory.AB,
                firstLicenseDate: new Date(2020, 10, 2),
                expirationDate: new Date(2026, 10, 11),
                expectedError: "O número de registro não pode ser vazio."
            },
            {
                testCase: "Should throw error if category has empty.",
                userId: new UserId(),
                registration: "123456789",
                category: "" as DriveLicenseCategory,
                firstLicenseDate: new Date(2020, 10, 2),
                expirationDate: new Date(2026, 10, 11),
                expectedError: "Uma categoria deve ser selecionada."
            },
            {
                testCase: "Should throw error if category has invalid.",
                userId: new UserId(),
                registration: "123456789",
                category: "AF" as DriveLicenseCategory,
                firstLicenseDate: new Date(2020, 10, 2),
                expirationDate: new Date(2026, 10, 11),
                expectedError: "A categoria informada é inválida."
            },
            {
                testCase: "Should throw error if first license date has empty.",
                userId: new UserId(),
                registration: "123456789",
                category: DriveLicenseCategory.AB,
                firstLicenseDate: "" as unknown as Date,
                expirationDate: new Date(2026, 10, 11),
                expectedError: "A data da primeira habilitação deve ser passada."
            },
            {
                testCase: "Should throw error if expiration license date has empty.",
                userId: new UserId(),
                registration: "123456789",
                category: DriveLicenseCategory.AB,
                firstLicenseDate: new Date(2020, 10, 2),
                expirationDate: "" as unknown as Date,
                expectedError: "A data de expiração deve ser passada."
            },
            {
                testCase: "Should throw error if first license date has bad formated.",
                userId: new UserId(),
                registration: "123456789",
                category: DriveLicenseCategory.AB,
                firstLicenseDate: "10/02/2020" as unknown as Date,
                expirationDate: new Date(2026, 10, 11),
                expectedError: "Datas mal formatadas."
            },
            {
                testCase: "Should throw error if expirtion license date has bad formated.",
                userId: new UserId(),
                registration: "123456789",
                category: DriveLicenseCategory.AB,
                firstLicenseDate: new Date(2020, 10, 2),
                expirationDate: "10/11/2026" as unknown as Date,
                expectedError: "Datas mal formatadas."
            },
            {
                testCase: "It should throw an error if the expiration date is earlier than the date of the first license.",
                userId: new UserId(),
                registration: "123456789",
                category: DriveLicenseCategory.AB,
                firstLicenseDate: new Date(2020, 10, 2),
                expirationDate: new Date(2019, 10, 11),
                expectedError: "A data de expiração não pode ser menor que a data da primeira habilitação."
            },
        ])("$testCase", ({ userId, registration, category, firstLicenseDate, expirationDate, expectedError }) => {

            expect(() => {
                DriverLicense.create({
                    userId: userId,
                    registration: registration,
                    category: category,
                    firstLicenseDate: firstLicenseDate,
                    expirationDate: expirationDate
                });
            }).toThrow(expectedError);

        });
    });

    describe("Test method renewal.", () => {

        it("Should renew driver license.", () => {

            const driveLicense = DriverLicense.create({
                ...driveLicenseData,
                expirationDate: new Date(2026, 10, 16)
            });

            const newExpirationDate = new Date(2031, 10, 16);

            driveLicense.renewal(newExpirationDate);

            expect(driveLicense.expirationDate).toEqual(newExpirationDate);
        });

        it.each([
            {
                testCase: "It should throw an error if the expiration date is bad formatted.",
                newExpirationDate: "10/11/2026" as unknown as Date,
                expectedError: "Datas mal formatadas."
            },
            {
                testCase: "It should throw an error if the new expiration date is earlier than the date of the old expiration date.",
                newExpirationDate: new Date(2026, 9, 11),
                expectedError: "A nova data de expiração deve ser posterior à data atual."
            },
            {
                testCase: "It should throw an error if the new expiration date is equal than the date of the old expiration date.",
                newExpirationDate: new Date(2026, 10, 16),
                expectedError: "A nova data de expiração deve ser posterior à data atual."
            },
        ])("$testCase", ({ newExpirationDate, expectedError }) => {

            expect(() => {

                const driveLicense = DriverLicense.create({
                    ...driveLicenseData,
                    expirationDate: new Date(2026, 10, 16)
                });

                driveLicense.renewal(newExpirationDate);


            }).toThrow(expectedError);

        });
    });

    describe("Test add new Category method.", () => {
        it("Should change category in Driver License.", () => {

            const driveLicense = DriverLicense.create({
                ...driveLicenseData,
            });

            const newCategory = "AE";

            driveLicense.addNewCategory(DriveLicenseCategory[newCategory]);

            expect(driveLicense.category).toEqual(DriveLicenseCategory.AE);
        });


        it.each([
            {
                testCase: "It should throw an error if new category is not accepted.",
                newCategory: "AG" as unknown as DriveLicenseCategory,
                expectedError: "A categoria informada é inválida."
            },
            {
                testCase: "It should throw an error if new category is equal then actual category.",
                newCategory: DriveLicenseCategory.AC,
                expectedError: "A nova categoria não pode ser o mesmo da anterior."
            },
        ])("$testCase", ({ newCategory, expectedError }) => {

            expect(() => {

                const driveLicense = DriverLicense.create({
                    ...driveLicenseData,
                    category: DriveLicenseCategory.AC
                });

                driveLicense.addNewCategory(newCategory);


            }).toThrow(expectedError);

        });
    });

    it("Should restore a driver license.", () => {
        const driveLicense = DriverLicense.restore(driveLicenseData);

        expect(driveLicense).toBeInstanceOf(DriverLicense);
        expect(driveLicense.userId).toBeInstanceOf(UserId);
        expect(driveLicense.category).toBe(DriveLicenseCategory.AB);
        expect(driveLicense.registration).toBe(driveLicenseData.registration);
        expect(driveLicense.firstLicenseDate).toEqual(driveLicenseData.firstLicenseDate);
        expect(driveLicense.expirationDate).toEqual(driveLicenseData.expirationDate);
    });

});