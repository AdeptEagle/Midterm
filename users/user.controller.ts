import {Request, Response, NextFunction } from "express";
import { Router } from "express";
import * as Joi from "joi";
import { validateRequest } from "../_middleware/validation";
import { UserService } from "../users/user.service";
import { DepartmentRole } from "../_helpers/role.enum";
import { Like } from "typeorm";
import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee";

const router = Router();
const userService = new UserService();
export default router;



router.get("/", getAll); // Get all employees
router.get("/:id", getById); // Get employee by ID

//Case 1 
router.post("/employees", createSchema, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);


//case 2
export const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const employeeRepo = AppDataSource.getRepository(Employee);
        const [employees, total] = await employeeRepo.findAndCount({
            relations: ["department"],
            skip,
            take: limit
        });
        res.json({
            data: employees,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        next(error);
    }
};



router.get("/employees", getEmployees); // Get paginated employees




// Route functions
async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await userService.getAll(); 
        res.json(users);
    } catch (error) {
        next(error);
    }
}

async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await userService.getById(parseInt(req.params.id)); 
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.create(req.body); 
        res.json({ message: "User created" });
    } catch (error) {
        next(error);
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.update(parseInt(req.params.id), req.body); 
        res.json({ message: "User updated" });
    } catch (error) {
        next(error);
    }
}

async function _delete(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.delete(parseInt(req.params.id)); 
        res.json({ message: "User deleted" });
    } catch (error) {
        next(error);
    }
}


function createSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        name: Joi.string().required(),
        position: Joi.string().required(),
        departmentId: Joi.number().integer().required(),  // Match the entity foreign key
        hireDate: Joi.date().iso().optional(),           // Match the "date" type
        salary: Joi.number().integer().optional()
    });

    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        name: Joi.string().optional(),
        position: Joi.string().optional(),
        departmentId: Joi.number().integer().optional(),  // Allow updating department
        hireDate: Joi.date().iso().optional(),
        salary: Joi.number().integer().optional()
    });

    validateRequest(req, next, schema);
}

