
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { DatabaseModule } from "./infrastructure/database/database.module.js";

@Module({
    imports: [
        DatabaseModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>("JWT_SECRET"),
                signOptions: {
                    expiresIn: "1d"
                }
            })
        })
    ],
    exports: [JwtModule]
})
export class CoreModule {}
