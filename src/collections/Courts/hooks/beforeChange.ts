import payload from 'payload';
import { BeforeChangeHook } from 'payload/dist/collections/config/types';



// Example of how to use this hook in a collection configuration
const CourtsCollection = {
    slug: 'courts',
    fields: [
        {
            name: 'courtCode',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                readOnly: true,
            }
        },
        // other fields...
    ],
};

export default CourtsCollection;
