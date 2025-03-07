import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import * as bcrypt from "bcryptjs";
import { DepartmentRole } from "../_helpers/role.enum";
import { Employee } from "./employee";

@Entity()
export class Department{
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    Department: string;

    @OneToMany(()=> Employee, (employee)=> employee.department)
    employees: Employee[];
}