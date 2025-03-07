import { Request, Response } from "express";
import { LessThan, Not, IsNull } from "typeorm";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee.entity";

export const deactivateInactiveEmployees = async (req: Request, res: Response) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    try {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const inactiveEmployees = await employeeRepository.find({
            where: { lastActivityDate: LessThan(sixMonthsAgo), isActive: true },
        });

        if (inactiveEmployees.length === 0) {
            return res.status(200).json({ message: "No inactive employees found for deactivation." });
        }

        await employeeRepository.update(
            { lastActivityDate: LessThan(sixMonthsAgo), isActive: true },
            { isActive: false }
        );

        res.status(200).json({ message: "Inactive employees deactivated successfully!", count: inactiveEmployees.length });
    } catch (error) {
        res.status(500).json({ message: "Error deactivating employees", error: error.message });
    }
};
