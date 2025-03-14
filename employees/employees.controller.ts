import { Router, Response, Request, NextFunction } from "express";
import { ParsedQs } from "qs";
import {
  bulkImportEmployees,
  deactivateInactiveEmployees,
  addEmployee,
  getAllEmployees,
  updateEmployeeSalary,
  deleteEmployee,
  searchEmployees,
  transferEmployee,
} from "../employees.services";

const router = Router();

// Error Handling Middleware
const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: "Internal Server Error", error });
};

// Validate Request Body
const validateRequestBody = (req: Request, res: Response, requiredFields: string[]) => {
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
  }
};

// Validate Request Parameters
const validateRequestParams = (req: Request, res: Response, requiredParams: string[]) => {
  const missingParams = requiredParams.filter((param) => !req.params[param]);
  if (missingParams.length > 0) {
    return res.status(400).json({ message: `Missing required parameters: ${missingParams.join(", ")}` });
  }
};

// Bulk Import Employees
const bulkImportEmployeesRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await bulkImportEmployees(req, res);
  } catch (error) {
    next(error);
  }
};

// Deactivate Inactive Employees
const deactivateInactiveEmployeesRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deactivateInactiveEmployees(req, res);
  } catch (error) {
    next(error);
  }
};

// Add Employee
const addEmployeeRoute = async (req: Request<{}, {}, { name: string; position: string; departmentId: string; salary?: number; hireDate: string }, ParsedQs>, res: Response, next: NextFunction) => {
  try {
    const requiredFields = ["name", "position", "departmentId", "hireDate"];
    validateRequestBody(req, res, requiredFields);
    await addEmployee(req, res);
  } catch (error) {
    next(error);
  }
};

// Get All Employees
const getAllEmployeesRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getAllEmployees(req, res);
  } catch (error) {
    next(error);
  }
};

// Update Employee Salary
const updateEmployeeSalaryRoute = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const requiredFields = ["salary"];
    const requiredParams = ["id"];
    validateRequestBody(req, res, requiredFields);
    validateRequestParams(req, res, requiredParams);
    await updateEmployeeSalary(req, res);
  } catch (error) {
    next(error);
  }
};

// Delete Employee
const deleteEmployeeRoute = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const requiredParams = ["id"];
    validateRequestParams(req, res, requiredParams);
    await deleteEmployee(req, res);
  } catch (error) {
    next(error);
  }
};

// Search Employees
const searchEmployeesRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await searchEmployees(req, res);
  } catch (error) {
    next(error);
  }
};

// Transfer Employee
const transferEmployeeRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await transferEmployee(req, res);
  } catch (error) {
    next(error);
  }
};

// Define Routes
router.post("/bulk-import", bulkImportEmployeesRoute);
router.post("/deactivate-inactive", deactivateInactiveEmployeesRoute);
router.post("/add", addEmployeeRoute);
router.get("/all", getAllEmployeesRoute);
router.put("/update-salary/:id", updateEmployeeSalaryRoute);
router.delete("/delete/:id", deleteEmployeeRoute);
router.get("/search", searchEmployeesRoute);
router.post("/transfer", transferEmployeeRoute);

// Use Error Handling Middleware
router.use(errorHandler);

export default router;