import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { sequelize } from "./modules/core/infrastructure/database/sequelize.js";

async function bootstrap() {

  try {
    await sequelize.authenticate();

    console.log("Conexão estabelecida com o banco de dados");

    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);

  } catch (error) {
    
    console.error("Erro ao conectar com PostgreSQL:", error);
    process.exit(1);
  }
}
await bootstrap();
