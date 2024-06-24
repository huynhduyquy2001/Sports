import { Request, Response, NextFunction } from 'express';
import payload from 'payload';

export const search = async (req: Request, res: Response, next: NextFunction) => {
    req.params
    const { name, type } = req.query;

    if (!name && !type) {
        return res.status(400).json({ message: 'At least one query parameter is required' });
    }

    const where: any = {};
    //name
    if (name) {
        where.name = {
            like: `%${name}%`
        };
    }
    //type
    if (typeof type === 'string' && type) {
        const typesArray = type.split(',').map(t => t.trim());

        where['type.bussinessObject'] = {
            in: typesArray
        };
    }
    //Amenities
    try {
        const results = await payload.find({
            collection: 'partners',
            depth: 3,
            where: where
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
