import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "typeorm/driver/mongodb/bson.typings";


@Entity({
    name: 'products' // Name of the table in the database
})
export class Product {

    @ApiProperty({
        example: 'd3f4e5b6-7c8d-9e0f-1a2b-3c4d5e6f7g8h',
        description: 'Unique identifier for the product',
        type: UUID
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Title of the product',
        example: 'Nike Air Max 270',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    title: string;

    @ApiProperty({
        description: 'Price of the product',
        example: 129.99,
        default: 0.0
    })
    @Column('float', { default: 0.0 })
    price: number;

    @ApiProperty({ 
        description: 'Description of the product',
        example: 'A comfortable and stylish running shoe with a large air unit for cushioning.',
        type: String,
        required: false, 
    })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({
        description: 'Slug for the product, used in URLs',
        example: 'nike-air-max-270',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    slug: string;

    @ApiProperty({
        description: 'Stock quantity of the product',
        example: 100,
        default: 0
    })
    @Column('int', {default: 0})
    stock: number;

    @ApiProperty({
        description: 'Sizes available for the product',
        example: ['S', 'M', 'L', 'XL'],
        required: false, 
        type: [String] 
    })
    @Column('text', { array: true, default: [] })
    sizes: string[];

    @ApiProperty({
        description: "Gender of the product",
        example: 'unisex', 
    })
    @Column('text')
    gender: string;

    @ApiProperty({ 
        description: 'Tags associated with the product',
        example: ['shoes', 'running', 'nike'],
        required: false,
        type: [String] 
    })
    @Column('text', { array: true, default: [] })
    tags: string[]; // Tags for the product

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true,  } // Automatically load images with the product
    )
    images?: ProductImage[]; // Array of image URLs
    
    @ManyToOne(
        () => User,
        (user) => user.Products,
        { eager: true, onDelete: 'NO ACTION' } // Automatically load user with the product, set to null if user is deleted
    )
    user?: User

    @BeforeInsert()
    @BeforeUpdate()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
}
