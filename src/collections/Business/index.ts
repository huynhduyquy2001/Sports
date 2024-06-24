import { CollectionConfig } from "payload/types";
import { checkRole } from "../Users/checkRole";
import { admins } from "../access/admins";

const Business: CollectionConfig = {
    slug: 'business',
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
            name: 'description',
            type: 'textarea',
            label: 'Description',
        },
        {
            name: 'logo',
            type: 'upload',
            relationTo: 'media',
            label: 'Business Logo',
        },
    ],
};

export default Business;
