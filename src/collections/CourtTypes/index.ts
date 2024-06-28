import { CollectionConfig } from "payload/types";
import { checkRole } from "../Users/checkRole";
import { admins } from "../access/admins";

const CourtTypes: CollectionConfig = {
    slug: 'court-types',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
        create: admins,
        update: admins,
        delete: admins,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            label: 'Business Name',
            required: true,
        },
        {
            name: 'icon',
            type: 'upload',
            relationTo: 'media'
        },
    ],
};

export default CourtTypes;
