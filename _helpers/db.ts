import "reflect-metadata";
import { DataSource } from "typeorm";
import mysql from "mysql2/promise";
import { User } from "../users/user.entity"; 

async function ensureDatabaseExists() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "root",
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || "votingsys"}\``);
    await connection.end();
}

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "miditerm",
    entities: [User],
    synchronize: true,
    migrations: [],
    logging: true, 
});

ensureDatabaseExists().then(() => {
    AppDataSource.initialize()
        .then(() => console.log("Database Connected!"))
        .catch((error) => console.error("Database Connection Error:", error));
});
