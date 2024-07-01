import payload from 'payload';
import { AfterChangeHook } from 'payload/dist/collections/config/types';
import { compareSignatures, generateSignature } from '../../../utils/generateSignature';

export const afterBookingChange: AfterChangeHook = async ({ doc, req, operation }) => {
    const formData = {
        courtID: doc.court.id,
        userID: doc.user.id,
        bookingDate: doc.user.bookingDate,
        startTime: doc.bookingTime.startTime,
        endTime: doc.bookingTime.endTime,
        bookingStatus: doc.bookingStatus,
        paymentId: doc.payment.paymentId
    }
    if (operation === 'create') {
        const globalSettings = await payload.findGlobal({
            slug: 'settings',
        });

        if (!globalSettings) {
            throw new Error('Global settings not found');
        }

        const checksumKey = globalSettings.checksumKey;

        const newSignature = generateSignature(formData, checksumKey);


    }

    return doc;
};
