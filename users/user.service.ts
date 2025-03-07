import { AppDataSource } from "../_helpers/db";
import { Employee } from "./employee";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { DepartmentRole } from "_helpers/role.enum";

export class UserService {
    private userRepository: Repository<Employee>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(Employee);
    }

    async getAll() {
        return await this.userRepository.find({
            select: ["id", "name", "position", "salary", "email","isActive",], 
        });
    }
    

    async getById(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new Error("User not found");
        return user;
    }

    async create(params: Partial<Employee> & { password?: string }) {
        if (await this.userRepository.findOneBy({ email: params.email })) {
            throw new Error(`Email "${params.email}" is already registered`);
        }

        const user = this.userRepository.create(params);

        await this.userRepository.save(user);
    }

    async update(id: number, params: Partial<Employee> & { password?: string }) {
        const user = await this.getById(id);

        if (params.email && user.email !== params.email) {
            if (await this.userRepository.findOneBy({ email: params.email })) {
                throw new Error(`Email "${params.email}" is already taken`);
            }
        }

        Object.assign(user, params);
        await this.userRepository.save(user);
    }

    async delete(id: number) {
        const user = await this.getById(id);
        await this.userRepository.remove(user);
    }
}

export const userService = new UserService();