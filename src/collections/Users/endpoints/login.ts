import express from "express";
import payload from "payload";

export const login = async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const result = await payload.login({
            collection: 'users',
            data: {
                email: email,
                password: password,
            },
        });
        if (result.user.accountStatus === 'suspended') {
            return res.status(401).json({ message: 'Account has been banned' });
        } else if (result.user.accountStatus === 'deleted') {
            return res.status(401).json({ message: 'Account has been deleted' });
        }
        req.session.tempUser = result.user;
        req.session.tempToken = result.token;
        if (!result.user.auth2) {
            const collectionConfig = payload.collections["users"].config;
            // Set a cookie in the response with the JWT
            res.cookie(`${payload.config.cookiePrefix}-token`, result.token, {
                path: "/",  // Cookie path
                httpOnly: true,  // HttpOnly flag for security
                expires: getCookieExpiration(collectionConfig.auth.tokenExpiration),  // Cookie expiration time
                secure: collectionConfig.auth.cookies.secure,  // Secure flag (for HTTPS)
                sameSite: collectionConfig.auth.cookies.sameSite,  // SameSite attribute
                domain: collectionConfig.auth.cookies.domain || undefined,  // Cookie domain
            });
            return res.status(200).json({ user: result.user, token: result.token });
        } else {
            return res.status(200).json({ user: result.user });
        }
    } catch (error) {
        // Handle specific errors
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        // Handle other errors if necessary
        return res.status(500).json({ message: error.message });
    }
};
const getCookieExpiration = (expiration: string | number) => {
    if (typeof expiration === 'number') {
        return new Date(Date.now() + expiration * 1000); // expiration is in seconds
    } else if (typeof expiration === 'string') {
        return new Date(expiration);
    } else {
        throw new Error('Invalid token expiration format');
    }
};