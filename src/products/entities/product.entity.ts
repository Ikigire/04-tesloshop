import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';


@Entity({
    name: 'products' // Name of the table in the database
})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    title: string;

    @Column('float', { default: 0.0 })
    price: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column('text', { unique: true })
    slug: string;

    @Column('int', {default: 0})
    stock: number;

    @Column('text', { array: true, default: [] })
    sizes: string[];

    @Column('text')
    gender: string;

    @Column('text', { array: true, default: [] })
    tags: string[]; // Tags for the product

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true } // Automatically load images with the product
    )
    images?: ProductImage[]; // Array of image URLs
    

    @BeforeInsert()
    @BeforeUpdate()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
}
