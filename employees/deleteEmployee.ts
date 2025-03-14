import { Request, Response } from "express";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee.entity";

export const deleteEmployee = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        return res.status(400).json({ message: "Invalid employee ID." });
    }

    try {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOneBy({ id: Number(id) });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        employee.isActive = false; // Soft delete
        await employeeRepository.save(employee);
        res.status(200).json({ message: "Employee deleted successfully!", employee });
    } catch (error) {
        console.error("Error deleting employee:", error.message);
        res.status(500).json({ message: "Error deleting employee", error: error.message });
    }
};
