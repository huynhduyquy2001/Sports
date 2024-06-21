import { CollectionConfig } from 'payload/types';

const PartnerSpecs: CollectionConfig = {
    slug: 'partner-specs',
    fields: [
        {
            name: 'followingCount',
            type: 'number',
        },
        {
            name: 'followerCount',
            type: 'number',
        },
        {
            name: 'ratingStar',
            type: 'number',
        },
        {
            name: 'responseRate',
            type: 'number',
        },
        {
            name: 'responseTime',
            type: 'number',
        },
        {
            name: 'owner',
            type: 'relationship',
            relationTo: 'partners',
            hasMany: false,
            admin: {
                allowCreate: false
            }
        },
        {
            name: 'isMerchantVerified',
            type: 'checkbox',
        },
        {
            name: 'itemCount',
            type: 'number',
        },
        {
            name: 'lastActiveTime',
            type: 'number',
        },
        {
            name: 'chatDisabled',
            type: 'checkbox',
        },
    ],
};

export default PartnerSpecs;