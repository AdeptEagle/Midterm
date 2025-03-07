import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import * as bcrypt from "bcryptjs";
import { DepartmentRole } from "../_helpers/role.enum";
import { Department } from "../users/department";
@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, unique: true })
    name: string;

    @Column({ type: "varchar", length: 255 })
    position: string;

    @Column({nullable:true})
    salary: number;

    @Column({ type: "varchar", length: 255 })
    email: string;

    @ManyToOne(() => Department)
    department: Department;

    @Column({ default:true })
    isActive: boolean;

    @CreateDateColumn()
    hireDate: Date;
}

