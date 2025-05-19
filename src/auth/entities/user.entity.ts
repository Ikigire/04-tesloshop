import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ type: 'text'})
    password: string;
    
    @Column({ type: 'text' })
    fullname: string;

    @Column('text', { array: true, default: ['user'] })
    roles: string[];
    
    @Column({ type: 'bool', default: true})
    isActive: boolean;
    
}
