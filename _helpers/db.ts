import "reflect-metadata";
import { DataSource } from "typeorm";
import mysql from "mysql2/promise";
import { User } from "../users/user.entity";

async function ensureDatabaseExists() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASS || "root",
        });

        const dbName = process.env.DB_NAME || "employee_managemment";
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.end();
        console.log(`Database '${dbName}' ensured.`);
    } catch (error) {
        console.error("Error ensuring database exists:", error);
    }
}

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "employee_managemment",
    entities: [User],
    synchronize: true,
    logging: true,
});

ensureDatabaseExists().then(() => {
    AppDataSource.initialize()
        .then(() => console.log("Database Connected!"))
        .catch((error) => console.error("Database Connection Error:", error));
});
