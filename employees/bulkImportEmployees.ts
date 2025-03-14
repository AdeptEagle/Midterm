import { Request, Response } from "express";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee.entity"; // Assuming Employee entity is defined
import csv from "csv-parser"; // Importing csv-parser correctly
import { createLogger, format, transports } from 'winston'; // Importing logger

import fs from "fs";

export const bulkImportEmployees = async (req: Request, res: Response) => {

    const results: any[] = []; 
    const logger = createLogger({ // Defining logger
        level: 'info',
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'import.log' })
        ]
    });

const filePath = req.body.filePath; // Assuming the file path is sent in the request body
if (!filePath) {
    return res.status(400).json({ message: "File path is required." });
}


    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            try {
                const employeeRepository = AppDataSource.getRepository(Employee);
                for (const employeeData of results) {
                    if (!employeeData.name || !employeeData.position || !employeeData.departmentId) {
                        logger.warn("Missing required fields in employee data", employeeData);
                        continue; // Skip this record
                    }
                    const employee = employeeRepository.create(employeeData);

                    await employeeRepository.save(employee);
                }
                res.status(200).json({ message: "Employees imported successfully!" });
            } catch (error) {
                res.status(500).json({ message: "Error importing employees", error });
            }
        });
};
