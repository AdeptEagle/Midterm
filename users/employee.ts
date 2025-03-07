import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Department } from "./department";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    position: string;

    @ManyToOne(() => Department, (department) => department.employees, { onDelete: "CASCADE" })
    @JoinColumn({ name: "departmentId" })
    department: Department;

    @Column({ type: "date", nullable: true })
    hireDate: string;

    @Column({ type: "int", nullable: true })
    salary: number;

    @Column({ nullable: false })  // Explicitly adding departmentId column
    departmentId: number;
    
}
