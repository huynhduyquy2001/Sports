
import payload from 'payload';
import { BeforeChangeHook } from 'payload/dist/collections/config/types';
import { checkRole } from '../../Users/checkRole';

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

export const beforePartnerCreate: BeforeChangeHook = async ({ data, req, originalDoc, operation }) => {
    const user = req.user;
    if (!checkRole(['admin'], user)) {
        data.status = 'pending';
        data.owner = req.user.id;
    }
    if (operation === 'create' || operation === 'update') {
        // Generate a 32-character code
        const courtCode = generateRandomCode(32);
        // Add the generated code to the data
        data.checksumKey = courtCode;
    }
    return data; // Return the data if everything is fine
};
