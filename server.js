"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./_helpers/db");
const error_handler_1 = __importDefault(require("./_middleware/error-handler"));
const user_controller_1 = __importDefault(require("./users/user.controller"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// API routes
app.use("/users", user_controller_1.default);
// Global error handler
app.use(error_handler_1.default);
// Start the database and then the server
const port = process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
db_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected successfully!");
    app.listen(port, () => console.log(`Server listening on port ${port}`));
})
    .catch((error) => {
    console.error("Database connection failed:", error);
});
