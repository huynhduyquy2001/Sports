import payload from 'payload';
import { BeforeChangeHook } from 'payload/dist/collections/config/types';
import { checkRole } from '../../Users/checkRole';
import { TimeSlot } from 'payload/generated-types';

export const beforeBookingChange: BeforeChangeHook = async ({ data, req, originalDoc, operation }) => {
    const userID = data.user;
    const courtID = data.court;
    const bookingDate = data.bookingDate;
    const startTime = data.bookingTime.startTime;
    const endTime = data.bookingTime.endTime;

    if (endTime < startTime) {
        throw new Error("End time must be greater than start time");
    }

    if (operation === 'create') {
        const currentTime = new Date();
        const startDateTime = new Date(bookingDate);
        let hourlyRateID;
        startDateTime.setHours(startTime, 0, 0, 0);

        if (currentTime >= startDateTime) {
            throw new Error("Cannot create a booking in the past.");
        }

        const court = await payload.findByID({
            collection: 'courts',
            id: courtID
        });

        if (court) {
            hourlyRateID = court.hourlyRate; // Đảm bảo rằng hourlyRateID là UUID
        }
        const timeSlot = hourlyRateID.hourlyRate;
        if (timeSlot) {
            let totalPrice = 0;
            let currentHour = startTime;

            while (currentHour < endTime) {
                const rate = timeSlot.find((rate: { from: number; to: number; }) => currentHour >= rate.from && currentHour < rate.to);
                if (rate) {
                    totalPrice += rate.price;
                }
                currentHour++;
            }
            data.totalPrice = totalPrice;
        }

        try {
            const existingBooking = await payload.find({
                collection: "bookings",
                where: {
                    court: {
                        equals: courtID
                    },
                    bookingDate: {
                        equals: bookingDate
                    },
                    'bookingTime.startTime': {
                        equals: startTime
                    },
                    'bookingTime.endTime': {
                        equals: endTime
                    }
                }
            });

            if (existingBooking.totalDocs > 0) {
                throw new Error("Booking already exists for this user and court on this date and time.");
            }
        } catch (error) {
            console.error(error);
            throw new Error("Internal server error: " + error.message);
        }
    }

    return data;
};
