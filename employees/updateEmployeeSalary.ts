import { Request, Response } from "express";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee.entity";

export const updateEmployeeSalary = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { salary } = req.body;

    if (salary === undefined || typeof salary !== 'number') {
        return res.status(400).json({ message: "Salary is required." });
    }

    try {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOneBy({ id: Number(id) });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        employee.salary = salary;
        await employeeRepository.save(employee);
        res.status(200).json({ message: "Employee salary updated successfully!", employee });
    } catch (err) {
        console.error("Error updating employee salary:", err.message);
        res.status(500).json({ message: "Error updating employee salary", error: err.message });
    }
};
