"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Joi = __importStar(require("joi"));
const validation_1 = require("../_middleware/validation");
const user_service_1 = require("../users/user.service");
const router = (0, express_1.Router)();
const userService = new user_service_1.UserService();
router.get("/", getAll); //get employees
router.get("/", getById);
router.get("/:id/tenure", getById); //get tenure
router.post("/", createSchema, create);
router.post("/:id/projects", createSchema, create); //assign emp to proj
router.post("/bulk", createSchema, create);
router.put("/:id", updateSchema, update);
router.put("/:id/transfer", updateSchema, update); //dept transfer 
router.get("/:id/salary", getById); //update salary
router.delete("/:id", _delete);
exports.default = router;
// Route functions
function getAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield userService.getAll();
            res.json(users);
        }
        catch (error) {
            next(error);
        }
    });
}
function getById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userService.getById(parseInt(req.params.id));
            res.json(user);
        }
        catch (error) {
            next(error);
        }
    });
}
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield userService.create(req.body);
            res.json({ message: "User created" });
        }
        catch (error) {
            next(error);
        }
    });
}
function update(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield userService.update(parseInt(req.params.id), req.body);
            res.json({ message: "User updated" });
        }
        catch (error) {
            next(error);
        }
    });
}
function _delete(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield userService.delete(parseInt(req.params.id));
            res.json({ message: "User deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
// Schema functions
function createSchema(req, res, next) {
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
    (0, validation_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
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
    (0, validation_1.validateRequest)(req, next, schema);
}
