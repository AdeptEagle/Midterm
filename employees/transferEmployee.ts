import { Request, Response } from "express";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee.entity";

export const transferEmployee = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { departmentId } = req.body;

    if (!departmentId) {
        return res.status(400).json({ message: "Department ID is required." });
    }

    try {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOneBy({ id: Number(id) });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        employee.departmentId = departmentId;
        await employeeRepository.save(employee);
        res.status(200).json({ message: "Employee transferred successfully!", employee });
    } catch (error) {
        res.status(500).json({ message: "Error transferring employee", error: error.message });
    }
};
