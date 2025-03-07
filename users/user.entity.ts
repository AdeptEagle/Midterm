import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, AfterLoad } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Role } from "../_helpers/role.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    employeeId: number;

    @Column({ type: "varchar", length: 255, unique: true })
    email: string;

    @Column({ type: "varchar", length: 255 })
    passwordHash: string;

    @Column({ type: "varchar", length: 50 })
    title: string;

    @Column({ type: "varchar", length: 100 })
    firstName: string;

    @Column({ type: "varchar", length: 100 })
    lastName: string;

    @Column({ type: "varchar", length: 100, default: "Unknown", nullable: true })
    Department: string;

    @Column({ type: "varchar", length: 100, default: "Unknown", nullable: true })
    Course: string;

    @Column({ type: "enum", enum: Role, default: Role.User })
    role: Role;

    @Column({ type: "date", nullable: false })
    hireDate: Date;

    yearsOfService: number;
    projectId: any;

    @AfterLoad()
    calculateYearsOfService() {
        if (this.hireDate) {
            const currentYear = new Date().getFullYear();
            const hireYear = new Date(this.hireDate).getFullYear();
            this.yearsOfService = currentYear - hireYear;
        } else {
            this.yearsOfService = 0;
        }
    }
}
