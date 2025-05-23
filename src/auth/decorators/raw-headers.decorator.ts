import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const headers = request.rawHeaders; // Get the raw headers from the request object

        if (!headers) {
            return null; // If no headers are found, return null
        }

        return (!data) ?
            headers // Return the raw headers
            :
            headers[data]; // Return the specific header based on the provided key
    }
);