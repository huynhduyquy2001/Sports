import { CollectionConfig } from 'payload/types';
import adminsAndUser from '../Users/access/adminsAndUser';
import { beforePartnerCreate } from './hooks/beforeCreate';
import { checkRole } from '../Users/checkRole';
import { search } from './endpoints/Search';
import { admins } from '../access/admins';
import { anyone } from '../access/anyone';

const Partners: CollectionConfig = {
    slug: 'partners',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        read: anyone,
        update: adminsAndUser,
        delete: admins,
    },
    hooks: {
        beforeChange: [beforePartnerCreate]
    },
    endpoints: [
        {
            path: '/search',
            method: 'get',
            handler: search
        }
    ],
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
            ],
            defaultValue: 'pending'
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
                            type: 'select',
                            hasMany: true,
                            options: [
                                {
                                    label: 'Wifi',
                                    value: 'wifi',
                                },
                                {
                                    label: 'Changing room',
                                    value: 'changing_room',
                                },
                                {
                                    label: 'Drinking Water',
                                    value: 'drinking_water',
                                },
                                {
                                    label: 'Flood lights',
                                    value: 'flood_lights',
                                },
                                {
                                    label: 'Washroom',
                                    value: 'washroom',
                                },
                                // Thêm các tùy chọn khác nếu cần
                            ],
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'locationLongitude',
                                    type: 'number',
                                    admin: { width: '50%' }
                                },
                                {
                                    name: 'locationLatitude',
                                    type: 'number',
                                    admin: { width: '50%' }
                                }
                            ]
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'averageRating',
                                    type: 'number',
                                    admin: {
                                        width: '50%'
                                    },
                                    access: {
                                        update: admins,
                                        read: admins
                                    },
                                    defaultValue: 0,
                                    min: 0,
                                    max: 5
                                },
                                {
                                    name: 'ratingCount',
                                    type: 'number',
                                    admin: {
                                        width: '50%'
                                    },
                                    access: {
                                        read: admins,
                                        update: admins,
                                    },
                                    defaultValue: 0,

                                },
                            ]
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
                    name: 'type',
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
                            type: 'relationship',
                            relationTo: 'business',
                            hasMany: true,
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
                            name: 'product',
                            type: 'relationship',
                            relationTo: 'products',
                            hasMany: true,
                        },
                    ],
                    access: {
                        read: ({ req }) => {
                            return req.user.id;
                        }
                    }
                },
                {
                    name: 'offers',
                    label: 'Offers', // required
                    interfaceName: 'offers', // optional (`name` must be present)
                    fields: [
                        {
                            name: 'offer',
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
    ],
};

export default Partners;