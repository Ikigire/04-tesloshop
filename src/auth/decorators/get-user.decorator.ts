import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user; // Extract the user from the request object

        if (!user) {
            throw new InternalServerErrorException('User not found (request)') ; // If no user is found, return null
        }

        return (!data) ?
            user // Return the user
            :
            user[data]; // Return the specific property of the user
    }
);