"use strict";
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
exports.userService = exports.UserService = void 0;
const db_1 = require("../_helpers/db");
const employee_1 = require("./employee");
class UserService {
    constructor() {
        this.userRepository = db_1.AppDataSource.getRepository(employee_1.Employee);
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find({
                select: ["id", "name", "position", "salary", "email", "isActive",],
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneBy({ id });
            if (!user)
                throw new Error("User not found");
            return user;
        });
    }
    create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.userRepository.findOneBy({ email: params.email })) {
                throw new Error(`Email "${params.email}" is already registered`);
            }
            const user = this.userRepository.create(params);
            yield this.userRepository.save(user);
        });
    }
    update(id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getById(id);
            if (params.email && user.email !== params.email) {
                if (yield this.userRepository.findOneBy({ email: params.email })) {
                    throw new Error(`Email "${params.email}" is already taken`);
                }
            }
            Object.assign(user, params);
            yield this.userRepository.save(user);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getById(id);
            yield this.userRepository.remove(user);
        });
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
