import { Request, Response } from "express";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee.entity";
import { Like } from "typeorm"; // Importing Like from TypeORM

export const searchEmployees = async (req: Request, res: Response) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: "Name query parameter is required." });
    }

    try {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employees = await employeeRepository.find({
            where: {
                name: Like(`%${name}%`), // Using TypeORM's Like operator for partial matching
            },
        });

        res.status(200).json({
            message: "Employees retrieved successfully!",
            data: employees,
        });
    } catch (error) {
        res.status(500).json({ message: "Error searching employees", error: error.message });
    }

};
