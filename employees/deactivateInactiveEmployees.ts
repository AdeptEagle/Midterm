import { Request, Response } from "express";
import { LessThan } from "typeorm";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee.entity";

import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'deactivation.log' })
    ]
});

export const deactivateInactiveEmployees = async (req: Request, res: Response) => {
    // Validate request parameters
    if (!req.body) {
        return res.status(400).json({ message: "Request body is required." });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    try {
        const employeeRepository = AppDataSource.getRepository(Employee);
        
        // Log the search for inactive employees
        logger.info("Searching for inactive employees to deactivate.");

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

        logger.info(`Deactivated ${inactiveEmployees.length} inactive employees.`);
        res.status(200).json({ message: "Inactive employees deactivated successfully!", count: inactiveEmployees.length });

    } catch (error) {
        logger.error(`Error deactivating employees: ${error.message}`);
        res.status(500).json({ message: "Error deactivating employees", error: error.message });
    }
};
