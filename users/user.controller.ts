import { Router, Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import { validateRequest } from "../_middleware/validation";
import { UserService } from "../users/user.service";
import { DepartmentRole } from "../_helpers/role.enum";
import { Like } from "typeorm";


const router = Router();
const userService = new UserService();

router.get("/", getAll); //get employees
router.get("/",getById); 
router.get("/:id/tenure",getById);  //get tenure
router.post("/", createSchema, create);
router.post("/:id/projects", createSchema, create); //assign emp to proj
router.post("/bulk", createSchema, create);
router.put("/:id", updateSchema, update);
router.put("/:id/transfer", updateSchema, update); //dept transfer 
router.get("/:id/salary", getById); //update salary
router.delete("/:id", _delete);

export default router;

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

// Schema functions
function createSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        name: Joi.string().required(),
        position: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        department: Joi.object({
            id: Joi.number().integer().required(),
            name: Joi.string().valid("Engineering", "Finance", "Human Resources", "Marketing").required(),
        }).required()
    });

    validateRequest(req, next, schema);
}
function updateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        name: Joi.string().optional(),
        position: Joi.string().optional(),
        lastName: Joi.string().optional(),
        email: Joi.string().email().optional(),
        department: Joi.object({
            id: Joi.number().integer().optional(),
            name: Joi.string().valid("Engineering", "Finance", "Human Resources", "Marketing").optional(),
        }).optional()
    });

    validateRequest(req, next, schema);
}