import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    position: string;

    @Column()
    departmentId: number;

    @Column()
    salary: number;

    @Column()
    hireDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    lastActivityDate: Date; // Assuming this field is used for deactivation logic
}
