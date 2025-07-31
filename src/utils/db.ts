import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USERNAME!,
    process.env.DB_PASS!,
    {
        dialect: "postgres",
        host: process.env.DB_HOST!,
    }
)