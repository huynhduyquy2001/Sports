import { Request, Response, NextFunction } from 'express';
import payload from 'payload';

export const getAvailableTime = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date, courtID, partnerID } = req.query;

        // check query
        if (!date || !courtID || !partnerID) {
            return res.status(400).json({ message: 'Date, courtID, and partnerID are required' });
        }
        // find court
        const court = await payload.findByID({
            collection: 'courts',
            id: String(courtID)
        });

        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }

        // find partner
        const partner = await payload.findByID({
            collection: 'partners',
            id: String(partnerID)
        });

        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        // check open time and close time
        const openingTime = typeof partner.openingTimeAt === 'number' ? partner.openingTimeAt : 6;
        const closingTime = typeof partner.closingTimeAt === 'number' ? partner.closingTimeAt : 22;

        const [day, month, year] = String(date).split('-');
        const newDate = new Date(`${year}-${month}-${day}T12:00:00.000Z`);
        // Get all reservations for the selected date
        const bookings = await payload.find({
            collection: 'bookings',
            where: {
                court: {
                    equals: courtID
                },
                bookingDate: {
                    equals: newDate
                }
            }
        });
        const bookedSlots = bookings.docs.map(booking => ({
            startTime: booking.bookingTime.startTime,
            endTime: booking.bookingTime.endTime
        }));

        const fullRange = [];
        for (let hour = openingTime; hour < closingTime; hour++) {
            fullRange.push({ startTime: hour, endTime: hour + 1 });
        }
        const availableSlots = fullRange.map(slot => {
            const isBooked = bookedSlots.some(bookedSlot => {
                return (
                    (slot.startTime >= bookedSlot.startTime && slot.startTime < bookedSlot.endTime) || // slot starts within bookedSlot
                    (slot.endTime > bookedSlot.startTime && slot.endTime <= bookedSlot.endTime) || // slot ends within bookedSlot
                    (slot.startTime <= bookedSlot.startTime && slot.endTime >= bookedSlot.endTime) // slot completely overlaps bookedSlot
                );
            });

            return {
                ...slot,
                available: !isBooked
            };
        });
        // response svailable time 
        res.status(200).json(availableSlots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
