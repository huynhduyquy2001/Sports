import { CollectionConfig } from 'payload/types';
import adminsAndUser from '../Users/access/adminsAndUser';
import { getAvailableTime } from './endpoints/getAvailableTime';
import { admins } from '../access/admins';
import { beforeCourtsChange } from './hooks/beforeChange';

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
        }
    ],
    hooks: {
        beforeChange: [beforeCourtsChange]
    },
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
        }, {
            name: 'checksumKey',
            type: 'text',
            access: {
                read: admins,
                update: () => false,
            }
        },
        {
            name: 'type',
            type: 'select',
            hasMany: false,
            options: [
                {
                    label: 'Badminton',
                    value: 'badminton',
                },
                {
                    label: 'Basketball',
                    value: 'basketball',
                },
                {
                    label: 'Pickleball',
                    value: 'pickleballl',
                },
                {
                    label: 'Soccer',
                    value: 'soccer',
                },
            ]
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
