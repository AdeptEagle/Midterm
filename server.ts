import "dotenv/config";
import "reflect-metadata"; 
import express from "express";
import cors from "cors";
import { AppDataSource } from "./_helpers/db";
import errorHandler from "./_middleware/error-handler";
import usersController from "./users/user.controller";
import employeesController from "./employees/employees.controller"; // Import employeesController


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API routes
app.use("/users", usersController);

// Global error handler
app.use(errorHandler);

// Start the database and then the server
const port = process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!");
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });
