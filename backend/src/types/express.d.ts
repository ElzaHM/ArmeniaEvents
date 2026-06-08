import 'express';

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        email: string;
        fullName: string;
      };
      accessToken?: string;
    }
  }
}

export {};
