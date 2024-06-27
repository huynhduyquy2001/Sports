import payload from 'payload';
import { BeforeChangeHook } from 'payload/dist/collections/config/types';

// Function to generate a random code with only letters
const generateRandomCode = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
};

// Define the beforeChange hook
export const beforeCourtsChange: BeforeChangeHook = async ({ data, req, originalDoc, operation }) => {
    if (operation === 'create') {
        // Generate a 32-character code
        const courtCode = generateRandomCode(32);
        // Add the generated code to the data
        data.checksumKey = courtCode;
    }
    return data; // Return the modified data
};

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
    hooks: {
        beforeChange: [beforeCourtsChange],
    },
};

export default CourtsCollection;
