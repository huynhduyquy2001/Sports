import { CollectionConfig } from "payload/types";

export const Offers: CollectionConfig = {
    slug: 'offers',
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Offer Title',
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
            label: 'Offer Description',
        },
        {
            name: 'discountPercentage',
            type: 'number',
            required: true,
            label: 'Discount Percentage',
            validate: (value) => {
                if (value < 0 || value > 100) {
                    return 'Discount percentage must be between 0 and 100';
                }
            },
        },
        {
            name: 'startDate',
            type: 'date',
            required: true,
            label: 'Start Date',
        },
        {
            name: 'endDate',
            type: 'date',
            required: true,
            label: 'End Date',
        },
        {
            name: 'terms',
            type: 'textarea',
            label: 'Terms and Conditions',
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            label: 'Offer Image',
        },
    ],
};
