import { CollectionConfig } from 'payload/types';

// Payments Collection (Optional)
const Payments: CollectionConfig = {
    slug: 'payments',
    fields: [
        {
            name: 'booking',
            type: 'relationship',
            relationTo: 'bookings',
            required: true,
        },
        {
            name: 'amount',
            type: 'number',
            required: true,
        },
        {
            name: 'paymentMethod',
            type: 'select',
            options: [
                { value: 'credit-card', label: 'Credit Card' },
                { value: 'paypal', label: 'PayPal' },
                { value: 'bank-transfer', label: 'Bank Transfer' },
            ],
            required: true,
        },
        {
            name: 'status',
            type: 'select',
            options: [
                { value: 'pending', label: 'Pending' },
                { value: 'successful', label: 'Successful' },
                { value: 'failed', label: 'Failed' },
            ],
            defaultValue: 'pending',
        },
        {
            name: 'createdAt',
            type: 'date',
            required: true,
        },
    ],
};

export default Payments;
