import { Umzug, SequelizeStorage } from "umzug";
import { sequelize } from "./sequelize.js";
import { pathToFileURL } from "node:url";

export const migrator = new Umzug({
    migrations: {
        glob: "src/modules/core/infrastructure/database/migrations/*.ts",
        resolve: ({ name, path, context }) => ({
        name,
        up: async () => {
            const migration = await import(pathToFileURL(path as string).href);
            return migration.up({ context });
        },
        down: async () => {
            const migration = await import(pathToFileURL(path as string).href);
            return migration.down({ context });
        }
    })
    },
    context: sequelize,
    storage: new SequelizeStorage({
        sequelize
    }),
    logger: console
});

async function runMigration() {
    const action = process.argv[2];

    try {
        await sequelize.authenticate();

        switch (action) {
            case "up":
                await migrator.up();
                break;

            case "down":
                await migrator.down();
                break;

            case "pending": {
                const migrations = await migrator.pending();
                console.log("Migrations pendentes:", migrations.map(m => m.name));
                break;
            }

            default:
                throw new Error("Comando inválido. Utilize up, down ou pending.");
        }
    } catch (error) {
        console.error("Erro ao executar migration:", error);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

await runMigration();