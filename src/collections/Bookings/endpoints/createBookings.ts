import { Request, Response, NextFunction } from 'express';
import payload from 'payload';
import { generateSignature, compareSignatures } from '../../../utils/generateSignature';
import axios from 'axios';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { booking, signature } = req.body;

        // Validate input
        if (!booking || !signature) {
            return res.status(400).json({ error: 'Missing booking information or signature' });
        }

        // Fetch court information
        const court = await payload.findByID({
            collection: 'courts',
            id: booking.courtID,
            depth: 0
        });

        // Check if court exists
        if (!court) {
            return res.status(404).json({ error: 'Court not found' });
        }

        // Fetch partner information
        const partner = await payload.findByID({
            collection: 'partners',
            id: String(court.owner)
        });

        // Check if partner exists and get checksumKey
        if (!partner) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        const checksumKey = partner.checksumKey;

        // Generate a new signature
        const newSignature = generateSignature(booking, checksumKey);

        // Compare signatures
        const isValidSignature = compareSignatures(signature, newSignature);

        // Return result
        if (isValidSignature) {
            // Create a new booking
            const data = {
                court: booking.courtID,
                user: booking.userID,
                bookingDate: booking.bookingDate,
                bookingTime: {
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                },
                bookingStatus: booking.bookingStatus,
                payment: {
                    paymentId: booking.paymentId,
                },
                signature: signature
            }
            const newBooking = await payload.create({
                collection: 'bookings',
                data: data
            });

            // If booking creation is successful
            if (newBooking) {
                // Fetch user information
                const user = await payload.findByID({
                    collection: 'users',
                    id: booking.userID,
                    depth: 0
                });

                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                const userEmail = user.email;

                const globalSettings = await payload.findGlobal({
                    slug: 'settings',
                });

                if (!globalSettings) {
                    throw new Error('Global settings not found');
                }
                // Data to generate signature
                const data: Record<string, any> = {
                    order_id: newBooking.id,
                    method: newBooking.payment.paymentId,
                    amount: newBooking.totalPrice,
                    currency: 'VND',
                    buyer_email: userEmail
                };
                const paymentChecksumKey = globalSettings.checksumKey;
                const paymentSignature = generateSignature(data, paymentChecksumKey);

                try {
                    const paymentApi = globalSettings.paymentApi;
                    const apiKey = globalSettings.apiKey;
                    const channelId = globalSettings.channelId;

                    // Make HTTP request to paymentApi with headers
                    const response = await axios.post(
                        paymentApi,
                        {
                            order_id: newBooking.id,
                            method: newBooking.payment.paymentId,
                            amount: newBooking.totalPrice,
                            currency: 'VND',
                            buyer_email: userEmail,
                            signature: paymentSignature
                        },
                        {
                            headers: {
                                'x-api-key': apiKey,
                                'x-channel-id': channelId,
                            },
                        }
                    );
                    // Update the booking with the paymentLink
                    const updatedBooking = await payload.update({
                        collection: 'bookings',
                        id: newBooking.id,
                        data: {
                            payment: {
                                ...newBooking.payment,
                                paymentLink: response.data._link.payment_link.href
                            }
                        }
                    });

                    // Return response with updated booking
                    return res.status(200).json({ booking: updatedBooking });
                } catch (error) {
                    // Catch errors and pass to error handling middleware
                    next(error);
                }
            }


            // Return success result
            return res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
        } else {
            return res.status(400).json({ error: 'Invalid signature' });
        }
    } catch (error) {
        // Handle unexpected errors
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
