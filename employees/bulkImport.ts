import { Request, Response } from "express";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee.entity"; // Assuming Employee entity is defined
import csv from "csv-parser"; // Importing csv-parser correctly
import * as fs from "fs";

export const bulkImportEmployees = (req: Request, res: Response) => {
    const results: any[] = [];
    const filePath = req.body.filePath; // Assuming the file path is sent in the request body

    if (!filePath || typeof filePath !== 'string') {
        return res.status(400).json({ message: "File path is required." });
    }

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            try {
                const employeeRepository = AppDataSource.getRepository(Employee);
                for (const employeeData of results) {
                    const employee = employeeRepository.create(employeeData);
                    await employeeRepository.save(employee);
                }
                res.status(200).json({ message: "Employees imported successfully!" });
            } catch (error) {
                console.error("Error importing employees:", error.message);
                res.status(500).json({ message: "Error importing employees", error });
            }
        });
};
