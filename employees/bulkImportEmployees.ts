import { Request, Response } from "express";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee.entity"; // Assuming Employee entity is defined
import csv from "csv-parser"; // Importing csv-parser correctly
import fs from "fs";

export const bulkImportEmployees = (req: Request, res: Response) => {
    const results: any[] = [];
    const filePath = req.body.filePath; // Assuming the file path is sent in the request body

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
                res.status(500).json({ message: "Error importing employees", error });
            }
        });
};
