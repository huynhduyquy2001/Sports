import { CollectionConfig } from 'payload/types';
import adminsAndUser from '../Users/access/adminsAndUser';
import { getAvailableTime } from './endpoints/getAvailableTime';
import { admins } from '../access/admins';

const Courts: CollectionConfig = {
    slug: 'courts',
    access: {
        read: () => true,
        update: adminsAndUser,
        delete: () => false
    },
    endpoints: [
        {
            path: '/get-available-time',
            method: 'get',
            handler: getAvailableTime
        },

    ],
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            admin: {
                description: 'The name of the court',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
            admin: {
                description: 'The description of the court',
            },
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'available',
            type: 'checkbox',
            defaultValue: true,
            admin: {
                description: 'Whether the court is available for booking',
            },
        },
        {
            name: 'type',
            type: 'relationship',
            hasMany: false,
            relationTo: 'court-types',
        },
        {
            name: 'owner',
            type: 'relationship',
            relationTo: 'partners',
            hasMany: false,
        },
        {
            name: 'hourlyRate',
            type: 'relationship',
            relationTo: 'time-slots',
            hasMany: false,
        },
    ],
    admin: {
        useAsTitle: "name"
    }
};

export default Courts;
