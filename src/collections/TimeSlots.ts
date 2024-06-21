import { CollectionConfig } from 'payload/types';

const TimeSlots: CollectionConfig = {
    slug: 'time-slots',
    fields: [
        {
            name: 'type',
            type: 'select',
            required: true,
            options: [
                {
                    label: 'Normal',
                    value: 'normal',
                },
                {
                    label: 'VIP',
                    value: 'vip',
                },
                {
                    label: 'Student',
                    value: 'student',
                },
            ],
            admin: {
                description: 'The type of the court',
            },
        },
        {
            name: 'hourlyRate', // required
            type: 'array', // required
            fields: [
                // required
                {
                    label: "From",
                    name: 'from',
                    type: 'number',
                },
                {
                    label: "To",
                    name: 'to',
                    type: 'number',
                },
                {
                    label: "Price",
                    name: 'price',
                    type: 'number',
                },
            ],
        },
    ],
};

export default TimeSlots;
