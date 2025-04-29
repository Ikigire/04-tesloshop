import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // Transform the value to a number
    limit?: number; // The maximum number of items to return

    @IsOptional()
    @Min(0) // Minimum value is 0
    @Type(() => Number) // Transform the value to a number
    offset?: number; // The number of items to skip before starting to collect the result set
}