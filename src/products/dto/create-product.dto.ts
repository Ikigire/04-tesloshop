import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: 'Title of the product',
        example: 'Nike Air Max 270',
        uniqueItems: true
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'Price of the product',
        example: 129.99,
        default: 0.0
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Description of the product',
        example: 'A comfortable and stylish running shoe with a large air unit for cushioning.',    
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Slug for the product, used in URLs',
        example: 'nike-air-max-270',
        uniqueItems: true
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Stock quantity of the product',
        example: 100,
        default: 0
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'Sizes available for the product',
        example: ['S', 'M', 'L', 'XL'],
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        description: "Gender of the product",
        example: 'unisex',
    })
    @IsString()
    @IsOptional()
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        description: 'Tags associated with the product',
        example: ['shoes', 'running', 'nike'],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty({
        description: 'Images of the product',
        example: ['image1.jpg', 'image2.jpg'],
        required: false,
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
