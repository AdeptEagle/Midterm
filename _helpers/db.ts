import "reflect-metadata";
import { DataSource } from "typeorm";
import mysql from "mysql2/promise";
import { Employee } from "../users/employee"; 
import { Department } from "../users/department"; // Ensure correct path
import { DepartmentRole } from "../_helpers/role.enum"; // Ensure correct path

async function ensureDatabaseExists() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASS || "root",
        });

        const dbName = process.env.DB_NAME || "midtermtest";
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`Database "${dbName}" ensured.`);
        await connection.end();
    } catch (error) {
        console.error("Error ensuring database exists:", error);
        process.exit(1);
    }
}

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "midtermtest",
    entities: [Employee, Department],
    synchronize: false, // Set to false in production and use migrations
    migrations: [],
    logging: true,
});

async function ensureDepartmentsExist() {
    const departmentRepository = AppDataSource.getRepository(Department);

    for (const role of Object.values(DepartmentRole)) {
        const existingDepartment = await departmentRepository.findOne({ where: { name: role } });
        if (!existingDepartment) {
            const department = departmentRepository.create({ name: role });
            await departmentRepository.save(department);
            console.log(`Inserted department: ${role}`);
        }
    }
}

(async () => {
    await ensureDatabaseExists();

    AppDataSource.initialize()
        .then(async () => {
            console.log("Database Connected!");
            await ensureDepartmentsExist();
        })
        .catch((error) => {
            console.error("Database Connection Error:", error);
            process.exit(1);
        });
})();
