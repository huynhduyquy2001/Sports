import axios from "axios";
import payload from "payload";

export const checkAuthentication = async (req, res, next) => {
    // The endpoint needs to bypass authentication
    const count = await payload.count({
        collection: 'users',
    });

    if (count.totalDocs === 0) {
        return next();
    }
    const excludedPaths = [
        '/forgot',
    ];
    // Check if the request url includes belongs to endpoints that need to be ignored
    if (excludedPaths.includes(req.path)) {
        return next();
    }
    let token = req.headers.cookie;
    if (!token) {
        return res.redirect('/admin/login');
    }
    try {
        token = req.headers.cookie.split('; ').find(row => row.startsWith('payload-token=')).split('=')[1];
        const response = await axios.get(process.env.PAYLOAD_PUBLIC_SERVER_URL + '/api/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // check if the user is valid
        if (response.status === 200 && response.data) {
            req.user = response.data;
            return next();
        }
    } catch (error) {
        return res.redirect('/admin/login');
    }
};