import { Request, Response, NextFunction } from 'express';
import payload from 'payload';
import axios from 'axios';

export const generateChecksumKey = async (req: Request, res: Response, next: NextFunction) => {
    const { courtID, userID, } = req.body
};
