import { CollectionConfig } from 'payload/types';
import adminsAndUser from '../Users/access/adminsAndUser';
import { admins } from '../access/admins';
import { beforeBookingChange } from './hooks/beforeBookingCreate';


// Bookings Collection
const Bookings: CollectionConfig = {
    slug: 'bookings',
    access: {
        read: adminsAndUser,
        update: admins,
        delete: () => false,
    },
    hooks: {
        beforeChange: [beforeBookingChange]
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

