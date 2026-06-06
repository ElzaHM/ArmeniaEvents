import 'express';

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        email: string;
        fullName: string;
        role: 'super_admin' | 'admin' | 'moderator' | 'user';
      };
      accessToken?: string;
    }
  }
}

export {};
