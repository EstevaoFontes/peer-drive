import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        SequelizeModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                dialect: "postgres",
                host: configService.getOrThrow<string>("DB_HOST"),
                port: configService.getOrThrow<number>("DB_PORT"),
                username: configService.getOrThrow<string>("DB_USERNAME"),
                password: configService.getOrThrow<string>("DB_PASSWORD"),
                database: configService.getOrThrow<string>("DB_NAME"),
                autoLoadModels: true,
                synchronize: false,
                logging: false
            })
        })
    ]
})
export class DatabaseModule {}
