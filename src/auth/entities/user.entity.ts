import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ type: 'text', select: false })
    password: string;
    
    @Column({ type: 'text' })
    fullname: string;

    @Column('text', { array: true, default: ['user'] })
    roles: string[];
    
    @Column({ type: 'bool', default: true})
    isActive: boolean;
    
    @BeforeInsert()
    @BeforeUpdate()
    checkEmailInsert() {
        this.email = this.email.toLowerCase().trim();
    }
}
