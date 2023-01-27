import { Router, Request, Response } from "express";
import fetch from "node-fetch";

export interface SecureRequest extends Request {
  userEmail?: string;
}

export const authorize = async (req: SecureRequest, res: Response, next: () => void) => {
  try {
    const response = await fetch(process.env.AUTH_SERVICE, {
      method: "GET",
      headers: {
        Cookie: `mockBookJWT=${req.cookies.mockBookJWT}`,
      },
    });

    const { isAuthenticated } = await response.json();

    if (isAuthenticated) {
      next();
    } else {
      res.status(401).send("<h1>Access Denied</h1>");
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Internal Server Error",
    });
  }
};
