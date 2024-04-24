// In a types.d.ts file in your project
declare namespace Express {
    export interface Request {
        user?: {
            id: number;
        }
    }
}
