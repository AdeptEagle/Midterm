import { Request, Response } from "express";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee.entity";

export const addEmployee = async (req: Request, res: Response) => {
    const { name, position, departmentId, salary, hireDate } = req.body;

    if (salary !== undefined && typeof salary !== 'number') {
        return res.status(400).json({ message: "Salary must be a number." });
    }

    if (!name || !position || !departmentId || !hireDate) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = employeeRepository.create({ name, position, departmentId, salary, hireDate });
        await employeeRepository.save(employee);
        res.status(201).json({ message: "Employee added successfully!", employee });
    } catch (error) {
        console.error("Error adding employee:", error.message);
        res.status(500).json({ message: "Error adding employee", error: error.message });
    }
};
