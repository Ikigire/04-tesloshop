import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from '../../products/entities/product.entity';

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
    
    @OneToMany(
        () => Product,
        (product) => product.user,
        { cascade: false, eager: false } // Avoid automatically load products with the user
    )
    Products?: Product[];

    @BeforeInsert()
    @BeforeUpdate()
    checkEmailInsert() {
        this.email = this.email.toLowerCase().trim();
    }
}
