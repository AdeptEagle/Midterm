import { Router, Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import { validateRequest } from "../_middleware/validation";
import { UserService } from "../users/user.service";
import { Role } from "../_helpers/role.enum";

const router = Router();
const userService = new UserService();

router.get("/", getAll);
router.get("/:id", getById);
router.get("/:id/tenure", getEmployeeTenure as any);
router.post("/", createSchema, create);
router.put("/:id", updateSchema, update);
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

async function getEmployeeTenure(req: Request, res: Response, next: NextFunction) {
    try {
        const employeeId = parseInt(req.params.id);
        const employee = await userService.getById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        if (!employee.hireDate) {
            return res.status(400).json({ message: "Hire date is missing for this employee" });
        }

        const hireDate = new Date(employee.hireDate);
        const currentYear = new Date().getFullYear();
        const yearsOfService = currentYear - hireDate.getFullYear();

        res.json({
            employeeId: employee.employeeId,
            name: `${employee.firstName} ${employee.lastName}`,
            yearsOfService,
        });
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
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(Role.Admin, Role.User, Role.Candidate).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
        hireDate: Joi.date().required(), // Added validation for hire date
    });

    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        title: Joi.string().empty(""),
        firstName: Joi.string().empty(""),
        lastName: Joi.string().empty(""),
        role: Joi.string().valid(Role.Admin, Role.User, Role.Candidate).empty(""),
        email: Joi.string().email().empty(""),
        password: Joi.string().min(6).empty(""),
        confirmPassword: Joi.string().valid(Joi.ref("password")).empty(""),
        hireDate: Joi.date().optional(), // Allow hireDate to be updated
    }).with("password", "confirmPassword");

    validateRequest(req, next, schema);
}
