import { Request, Response, NextFunction } from 'express';

type AsyncController = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => Promise<void>;

const catchErrors = (controller: AsyncController) => async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        await controller(req, res, next);
    } catch (error) {
        next(error);
    }
};

export default catchErrors;