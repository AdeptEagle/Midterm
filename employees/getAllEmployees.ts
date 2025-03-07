import { Request, Response } from "express";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee.entity";

export const getAllEmployees = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const [employees, total] = await employeeRepository.findAndCount({
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });

        res.status(200).json({
            message: "Employees retrieved successfully!",
            data: employees,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving employees", error: error.message });
    }
};
