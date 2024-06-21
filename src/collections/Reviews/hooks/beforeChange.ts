
import payload from 'payload';
import { BeforeChangeHook } from 'payload/dist/collections/config/types';

export const beforeReviewChange: BeforeChangeHook = async ({ data, req, originalDoc, operation }) => {
    const userID = data.reviewer;
    const partnerID = data.partner;

    if (operation === 'create') {
        try {
            const partner = await payload.findByID({
                collection: "partners",
                id: partnerID
            });

            let check = false;
            if (partner && Array.isArray(partner.courts)) {
                for (const element of partner.courts) {
                    const booking = await payload.find({
                        collection: "bookings",
                        where: {
                            user: {
                                equals: userID
                            },
                            court: {
                                equals: element.court.id
                            }
                        }
                    });

                    if (booking.totalDocs > 0) { // Check if there is any booking found
                        check = true;
                        break; // Exit the loop if a booking is found
                    }
                }
            }

            if (!check) {
                throw new Error("You are not authorized to review this partner");
            }
        } catch (error) {
            throw new Error("Internal server error");
        }
    }

    return data; // Return the data if everything is fine
};
