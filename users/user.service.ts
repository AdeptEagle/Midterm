import { AppDataSource } from "../_helpers/db";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";

export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async getAll() {
        return await this.userRepository.find({
            select: [
                "employeeId",
                "email",
                "title",
                "firstName",
                "lastName",
                "role",
                "Department",
                "Course",
                "hireDate",
                "yearsOfService",
            ],
        });
    }

    async getById(id: number) {
        const user = await this.userRepository.findOne({ where: { employeeId: id } });
        if (!user) throw new Error("User not found");
        return user;
    }

    async getEmployeeTenure(id: number) {
        const user = await this.getById(id);
        if (!user.hireDate) throw new Error("Hire date not set for this user");

        const currentYear = new Date().getFullYear();
        const hireYear = new Date(user.hireDate).getFullYear();
        return { employeeId: user.employeeId, name: `${user.firstName} ${user.lastName}`, yearsOfService: currentYear - hireYear };
    }

    async create(params: Partial<User> & { password?: string }) {
        if (await this.userRepository.findOne({ where: { email: params.email } })) {
            throw new Error(`Email "${params.email}" is already registered`);
        }

        const user = this.userRepository.create(params);

        // Handle password separately
        if (params.password) {
            user.passwordHash = await bcrypt.hash(params.password, 10);
            delete (params as any).password;
        }

        await this.userRepository.save(user);
    }

    async update(id: number, params: Partial<User> & { password?: string }) {
        const user = await this.getById(id);

        if (params.email && user.email !== params.email) {
            if (await this.userRepository.findOne({ where: { email: params.email } })) {
                throw new Error(`Email "${params.email}" is already taken`);
            }
        }
        if (params.password) {
            params.passwordHash = await bcrypt.hash(params.password, 10);
            delete (params as any).password;
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
