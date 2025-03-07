import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Department } from "../users/department";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "varchar", length: 50 })
  lastName: string;

  @Column({ type: "varchar", length: 100 })
  position: string;

  @Column({ type: "decimal", precision: 10, scale: 2})
  salary: number;

  @Column({ type: "varchar", length: 100, unique: true })
  email: string;

  @ManyToOne(() => Department, (department) => department.employees, { onDelete: "CASCADE" })
  @JoinColumn({ name: "departmentId" })
  department: Department;

  @Column()
  departmentId: number;

  @Column({ type: "boolean", default: true })
  isActive: boolean;
}
