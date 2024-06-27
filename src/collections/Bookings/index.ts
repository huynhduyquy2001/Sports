import { CollectionConfig } from 'payload/types';
import { admins } from '../access/admins';
import { beforeBookingChange } from './hooks/beforeBookingCreate';
import isBookingRead from './access/isBookingRead';
import { checkRole } from '../Users/checkRole';
import { afterBookingChange } from './hooks/afterBookingChange';


// Bookings Collection
const Bookings: CollectionConfig = {
    slug: 'bookings',
    access: {
        read: isBookingRead,
        update: isBookingRead,
    },
    hooks: {
        beforeChange: [beforeBookingChange],
        afterChange: [afterBookingChange]
    },
    fields: [
        {
            name: 'court',
            type: 'relationship',
            relationTo: 'courts',
            required: true,
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            access: {
                read: admins,
                update: admins
            }
        },
        {
            name: 'totalPrice',
            type: 'number',
            access: {
                read: () => true,
                update: admins
            },
            admin: {
                readOnly: true
            }
        },
        {
            name: 'signature',
            type: 'text',
            access: {
                read: admins,
                update: () => false
            },
            admin: {
                readOnly: true
            }
        },
        {
            name: 'bookingDate',
            type: 'date',
            required: true,
        },
        {
            name: 'bookingTime',
            type: 'group',
            fields: [
                // required
                {
                    name: 'startTime',
                    type: 'number',
                    required: true,
                },
                {
                    name: 'endTime',
                    type: 'number',
                    required: true,
                },
            ],
        },
        {
            name: 'bookingStatus',
            type: 'select',
            options: [
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'cancelled', label: 'Cancelled' },
            ],
            defaultValue: 'pending',
        },
        {
            name: 'paymentStatus',
            type: 'select',
            options: [
                { value: 'unpaid', label: 'Unpaid' },
                { value: 'paid', label: 'Paid' },
                { value: 'refunded', label: 'Refunded' },
            ],
            defaultValue: 'unpaid',
        },
    ],
    admin: {
        useAsTitle: "court"
    }
};

export default Bookings;

