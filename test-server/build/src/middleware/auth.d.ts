import { Request, Response } from "express";
export interface SecureRequest extends Request {
    userEmail?: string;
}
export declare const authorize: (req: SecureRequest, res: Response, next: () => void) => Promise<void>;
