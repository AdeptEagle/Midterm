import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { DepartmentRole } from "../_helpers/role.enum";
import { Employee } from "./employee";

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: DepartmentRole,
        unique: true,
    })
    name: DepartmentRole;

    @OneToMany(() => Employee, (employee) => employee.department)
    employees: Employee[];
}
