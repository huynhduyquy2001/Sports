import { CollectionConfig } from 'payload/types';
import { admins } from '../access/admins';
import { beforeBookingChange } from './hooks/beforeBookingCreate';
import isBookingRead from './access/isBookingRead';
import { afterBookingChange } from './hooks/afterBookingChange';
import { getPaymentMethod } from './endpoints/getPaymentMethod';
import { generateChecksumKey } from './endpoints/generateChecksumKey';
import { createBooking } from './endpoints/createBookings';
import adminsAndUser from '../Users/access/adminsAndUser';


// Bookings Collection
const Bookings: CollectionConfig = {
    slug: 'bookings',
    access: {
        read: isBookingRead,
        update: admins,
        create: adminsAndUser
    },
    hooks: {
        beforeChange: [beforeBookingChange],
        //afterChange: [afterBookingChange]
    },
    endpoints: [
        {
            path: '/get-payment-method',
            method: 'get',
            handler: getPaymentMethod
        },
        {
            path: '/generate-checksum-key',
            method: 'post',
            handler: generateChecksumKey
        },
        {
            path: '/create',
            method: 'post',
            handler: createBooking
        }
    ],

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
            type: 'row',
            fields: [
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
                    name: 'currency',
                    type: 'select',
                    options: ['VND', 'USD'],
                },
            ]
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
            type: 'group',
            name: 'payment',
            fields: [
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
                {
                    name: 'paymentId',
                    type: 'text',
                },
                {
                    name: 'paymentLink',
                    type: 'text',
                },
            ]
        },
    ],
    admin: {
        useAsTitle: "court"
    }
};

export default Bookings;

