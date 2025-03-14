"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const promise_1 = __importDefault(require("mysql2/promise"));
const employee_1 = require("../users/employee");
const department_1 = require("../users/department"); // Ensure correct path
const role_enum_1 = require("../_helpers/role.enum"); // Ensure correct path
function ensureDatabaseExists() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield promise_1.default.createConnection({
                host: process.env.DB_HOST || "localhost",
                user: process.env.DB_USER || "your_username", // Update with your MySQL username
                password: process.env.DB_PASS || "your_password", // Update with your MySQL password
            });
            const dbName = process.env.DB_NAME || "midtermtest";
            yield connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
            console.log(`Database "${dbName}" ensured.`);
            yield connection.end();
        }
        catch (error) {
            console.error("Error ensuring database exists:", error);
            process.exit(1);
        }
    });
}
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "your_database_name", // Update with your MySQL database name
    entities: [employee_1.Employee, department_1.Department],
    synchronize: true, // Set to false in production and use migrations
    migrations: [],
    logging: true,
});
function ensureDepartmentsExist() {
    return __awaiter(this, void 0, void 0, function* () {
        const departmentRepository = exports.AppDataSource.getRepository(department_1.Department);
        for (const role of Object.values(role_enum_1.DepartmentRole)) {
            const existingDepartment = yield departmentRepository.findOne({ where: { name: role } });
            if (!existingDepartment) {
                const department = departmentRepository.create({ name: role });
                yield departmentRepository.save(department);
                console.log(`Inserted department: ${role}`);
            }
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield ensureDatabaseExists();
    exports.AppDataSource.initialize()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Database Connected!");
        yield ensureDepartmentsExist();
    }))
        .catch((error) => {
        console.error("Database Connection Error:", error);
        process.exit(1);
    });
}))();
