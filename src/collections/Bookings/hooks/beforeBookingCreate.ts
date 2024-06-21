import payload from 'payload';
import { BeforeChangeHook } from 'payload/dist/collections/config/types';

export const beforeBookingChange: BeforeChangeHook = async ({ data, req, originalDoc, operation }) => {
    const userID = data.user;
    const courtID = data.court;
    const bookingDate = data.bookingDate;
    const startTime = data.startTime;
    const endTime = data.endTime;

    if (operation === 'create') {
        try {
            const existingBooking = await payload.find({
                collection: "bookings",
                where: {
                    user: {
                        equals: userID
                    },
                    court: {
                        equals: courtID
                    },
                    bookingDate: {
                        equals: bookingDate
                    },
                    startTime: {
                        equals: startTime
                    },
                    endTime: {
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

    return data; // Return the data if everything is fine
};
