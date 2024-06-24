import { CollectionConfig } from "payload/types";
import { beforeReviewChange } from "./hooks/beforeChange";
import { afterReviewChange } from "./hooks/afterChange";

export const Reviews: CollectionConfig = {
    slug: 'reviews',
    hooks: {
        beforeChange: [beforeReviewChange],
        afterChange: [afterReviewChange]
    },
    fields: [
        {
            name: 'partner',
            type: 'relationship',
            relationTo: 'partners',
            required: true,
            label: 'Partner',
        },
        {
            name: 'reviewer',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Reviewer',
        },
        {
            name: 'rating',
            type: 'number',
            required: true,
            label: 'Rating',
            min: 1,
            max: 5,
        },
        {
            name: 'comment',
            type: 'textarea',
            required: true,
            label: 'Comment',
        },
    ],
};

