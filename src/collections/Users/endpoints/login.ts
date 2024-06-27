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
            const cookieKey = 'payload-token';
            const cookieValue = result.token; // Use token from result
            const cookieOptions = {
                httpOnly: true, // Cookie can only be accessed by the server
                secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
                maxAge: 60 * 60 * 1000, // Cookie lasts for 1 hour
            };
            res.cookie(cookieKey, cookieValue, cookieOptions);
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