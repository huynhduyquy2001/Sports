import { CollectionConfig } from "payload/types";
import { admins } from "../access/admins";

export const Plans: CollectionConfig = {
    slug: 'plans',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        create: admins,
        update: admins,
        delete: admins,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'price',
                    type: 'number',
                    label: 'Price',
                    required: true,
                    admin: {
                        width: '33%'
                    },
                },
                {
                    name: 'durationValue',
                    type: 'number',
                    label: 'Duration Value',
                    admin: {
                        width: '33%'
                    },
                    min: 1,
                    defaultValue: 1
                },
                {
                    name: 'durationUnit',
                    type: 'select',
                    label: 'Duration Unit',
                    options: [
                        {
                            label: 'Month(s)',
                            value: 'months',
                        },
                        {
                            label: 'Year(s)',
                            value: 'years',
                        },
                    ],
                    defaultValue: 'months',
                    admin: {
                        width: '33%'
                    }
                }
            ]
        },

        {
            name: 'available',
            type: 'checkbox',
            defaultValue: true
        },
        {
            name: 'description',
            type: 'textarea',
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'numberOfPartnersUnlimited',
                    type: 'checkbox',
                    label: 'Unlimited Partners',
                    admin: {
                        width: '25%'
                    },
                    defaultValue: false
                },
                {
                    name: 'numberOfCourtsUnlimited',
                    type: 'checkbox',
                    label: 'Unlimited Courts',
                    admin: {
                        width: '25%'
                    },
                    defaultValue: false
                },
            ]
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'numberOfPartners',
                    type: 'number',
                    label: 'Number of Partners',
                    admin: {
                        condition: (data, siblingData) => {
                            return !siblingData.numberOfPartnersUnlimited;
                        },
                        width: '50%'
                    },
                    min: 1,
                    required: true,
                    defaultValue: 1,

                },
                {
                    name: 'numberOfCourts',
                    type: 'number',
                    label: 'Number of Courts',
                    admin: {
                        condition: (data, siblingData) => {
                            return !siblingData.numberOfCourtsUnlimited;
                        },
                        width: '50%'
                    },
                    min: 1
                }
            ]
        },
    ],
};
