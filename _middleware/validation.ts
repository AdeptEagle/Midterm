import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export function validateRequest(req: Request, next: NextFunction, schema: ObjectSchema) {
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
    };

    const { error, value } = schema.validate(req.body, options);
    if (error) {
        return next(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
    }

    req.body = value;
    next();
}
