import { Request, Response, NextFunction } from "express";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err); // Logs error for debugging
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack, // Hide stack in production
    });
}
