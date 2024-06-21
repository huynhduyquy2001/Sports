
import payload from 'payload';
import { BeforeChangeHook } from 'payload/dist/collections/config/types';
import { checkRole } from '../../Users/checkRole';

export const beforePartnerCreate: BeforeChangeHook = async ({ data, req, originalDoc, operation }) => {
    const user = req.user;
    if (!checkRole(['admin'], user)) {
        data.status = 'pending';
    }
    return data; // Return the data if everything is fine
};
