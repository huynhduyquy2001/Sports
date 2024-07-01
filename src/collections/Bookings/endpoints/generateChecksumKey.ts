import { Request, Response, NextFunction } from 'express';
import payload from 'payload';
import { generateSignature } from '../../../utils/generateSignature';

export const generateChecksumKey = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    try {
        const { courtID, userID, bookingDate, startTime, endTime, bookingStatus } = req.body;

        // Fetch court information
        const court = await payload.findByID({
            collection: 'courts',
            id: courtID,
            depth: 0
        });

        // Check if court exists
        if (!court) {
            return res.status(404).json({ error: 'Court not found' });
        }

        let checksumKey = '';

        // Fetch partner information
        const partner = await payload.findByID({
            collection: 'partners',
            id: String(court.owner)
        });

        // Check if partner exists and retrieve checksumKey
        if (partner) {
            checksumKey = partner.checksumKey;
        } else {
            return res.status(404).json({ error: 'Partner not found' });
        }

        // Generate the signature
        const signature = generateSignature(req.body, checksumKey);

        // Respond with the generated signature
        res.status(200).json({ signature });
    } catch (error) {
        // Handle unexpected errors
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
