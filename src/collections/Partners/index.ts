import { CollectionConfig } from 'payload/types';
import adminsAndUser from '../Users/access/adminsAndUser';
import { beforePartnerCreate } from './hooks/beforeCreate';

const Partners: CollectionConfig = {
    slug: 'partners',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        read: adminsAndUser,
        update: adminsAndUser,
        delete: () => false,
    },
    hooks: {
        beforeChange: [beforePartnerCreate]
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true
        },
        {
            name: 'owner',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
            required: true,
        },
        {
            name: 'status',
            type: 'select',
            options: [
                {
                    label: 'Pending',
                    value: 'pending'
                },
                {
                    label: 'Active',
                    value: 'active'
                },
                {
                    label: 'Inactive',
                    value: 'inactive'
                }
            ]
        },
        {
            type: 'tabs', // required
            tabs: [
                {
                    label: 'Information', // required
                    description: 'This will appear within the tab above the fields.',
                    fields: [
                        {
                            name: 'banner',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'avatar',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'images',
                            type: 'array',
                            label: 'Images',
                            fields: [
                                {
                                    name: 'image',
                                    type: 'upload',
                                    relationTo: 'media',
                                    required: true,
                                },
                            ]
                        },
                        {
                            name: 'daysOff',
                            type: 'select',
                            hasMany: true,
                            options: [
                                {
                                    label: 'Monday',
                                    value: 'monday',
                                },
                                {
                                    label: 'Tuesday',
                                    value: 'tuesday',
                                },
                                {
                                    label: 'Wednesday',
                                    value: 'wednesday',
                                },
                                {
                                    label: 'Thursday',
                                    value: 'thursday',
                                },
                                {
                                    label: 'Friday',
                                    value: 'friday',
                                },
                                {
                                    label: 'Saturday',
                                    value: 'saturday',
                                },
                                {
                                    label: 'Sunday',
                                    value: 'sunday',
                                },
                            ],
                        },
                        {
                            name: 'description',
                            type: 'textarea',
                        },
                        {
                            name: 'amenities',
                            type: 'text',
                            hasMany: true
                        },

                        {
                            name: 'location',
                            type: 'point',
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'openingTimeAt',
                                    type: 'number',
                                    admin: { width: '50%' },
                                },
                                {
                                    name: 'closingTimeAt',
                                    type: 'number',
                                    admin: { width: '50%' },
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'Type',
                    label: 'Type', // required
                    interfaceName: 'TabTwo', // optional (`name` must be present)
                    fields: [
                        {
                            name: 'bussinessType', // accessible via tabTwo.numberField
                            type: 'select',
                            options: [
                                {
                                    label: 'Renter',
                                    value: 'renter',
                                },
                                {
                                    label: 'Seller',
                                    value: 'seller',
                                },
                            ],
                            hasMany: true,
                            required: true,
                        },
                        {
                            name: 'bussinessObject', // accessible via tabTwo.numberField
                            type: 'select',
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
                            ],
                            hasMany: true,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'courts',
                    label: 'Courts', // required
                    interfaceName: 'courts', // optional (`name` must be present)
                    fields: [
                        {
                            name: 'court',
                            type: 'relationship',
                            relationTo: 'courts',
                            hasMany: true,
                        },
                    ],
                },
                {
                    name: 'products',
                    label: 'Products', // required
                    interfaceName: 'products', // optional (`name` must be present)
                    fields: [
                        {
                            name: 'products',
                            type: 'relationship',
                            relationTo: 'products',
                            hasMany: true,
                        },
                    ],
                },
                {
                    name: 'offers',
                    label: 'Offers', // required
                    interfaceName: 'offers', // optional (`name` must be present)
                    fields: [
                        {
                            name: 'offers',
                            type: 'array',
                            fields: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    required: true,
                                    label: 'Offer Name',
                                },
                                {
                                    name: 'description',
                                    type: 'textarea',
                                    required: false,
                                    label: 'Description',
                                },
                                {
                                    name: 'offerType',
                                    type: 'select',
                                    required: true,
                                    options: [
                                        {
                                            label: 'Percentage',
                                            value: 'percentage',
                                        },
                                        {
                                            label: 'Fixed Amount',
                                            value: 'fixed',
                                        },
                                        {
                                            label: 'Fixed Amount Per Product',
                                            value: 'fixedPerProduct',
                                        },
                                        {
                                            label: 'Freeship',
                                            value: 'freeship',
                                        },
                                    ],
                                },
                                {
                                    name: 'offerValue',
                                    type: 'number',
                                    required: true,
                                },
                                {
                                    name: 'maximumAmount',
                                    type: 'number',
                                    required: false,
                                    label: 'Maximum Amount',
                                },
                                {
                                    name: 'enable',
                                    type: 'checkbox',
                                    required: true,
                                    label: 'Enable',
                                },
                                {
                                    name: 'startDate',
                                    type: 'date',
                                    label: 'Start Date',
                                    admin: {
                                        date: {
                                            pickerAppearance: 'dayOnly',
                                        },
                                    },
                                },
                                {
                                    name: 'endDate',
                                    type: 'date',
                                    label: 'End Date',
                                    admin: {
                                        date: {
                                            pickerAppearance: 'dayOnly',
                                        },
                                    },
                                },
                            ]
                        }
                    ]
                }
            ],
        },
        // {
        //     name: 'products',
        //     type: 'relationship',
        //     relationTo: 'products',
        //     hasMany: true,
        //     required: true,
        // },
        // {
        //     name: 'orders',
        //     type: 'relationship',
        //     relationTo: 'orders',
        //     hasMany: true,
        //     required: true,
        // },
    ],
};

export default Partners;