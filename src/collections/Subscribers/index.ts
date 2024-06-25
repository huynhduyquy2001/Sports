import { CollectionConfig } from "payload/types";
import { admins } from "../access/admins";
import adminsAndUser from "../Users/access/adminsAndUser";

export const Subscribers: CollectionConfig = {
    slug: 'subscribers',
    admin: {
        useAsTitle: 'user',
    },
    access: {
        create: adminsAndUser,
        update: adminsAndUser,
        delete: adminsAndUser,
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users', // Assuming you have a 'users' collection
            required: true,
        },
        {
            name: 'plan',
            type: 'relationship',
            relationTo: 'plans',
            required: true,
        },
        {
            name: 'startDate',
            type: 'date',
            label: 'Start Date',
            required: true,
        },
        {
            name: 'endDate',
            type: 'date',
            label: 'End Date',
            required: true,
        },
    ],
};
