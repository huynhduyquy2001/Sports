import express from "express";
import payload from "payload";

export const verifyOTP = async (req: express.Request, res: express.Response) => {
    try {
        const email = req.session.tempUser?.email;
        const { verificationCode } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email not found in session.' });
        }

        if (!verificationCode) {
            return res.status(400).json({ message: 'OTP code not provided.' });
        }

        const userRecord = await payload.find({
            collection: 'users',
            where: {
                email: {
                    equals: email,
                },
            },
            limit: 1,
            depth: 1,
            overrideAccess: true,
            showHiddenFields: true,
        });

        if (userRecord.totalDocs === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userDoc = userRecord.docs[0];
        const currentTimestamp = Date.now();
        console.log(userDoc.otpAttempts);

        if (!userDoc.verificationCode) {
            return res.status(400).json({ message: 'Please request a verification code first.' });
        }

        if (Number(userDoc.verificationCode) !== Number(verificationCode)) {
            // Tăng số lần nhập sai OTP
            await payload.update({
                collection: 'users',
                id: userDoc.id,
                data: {
                    otpAttempts: userDoc.otpAttempts + 1,
                },
            });

            if (userDoc.otpAttempts + 1 >= 3) {
                // Vô hiệu hóa mã OTP sau khi vượt quá số lần nhập sai
                await payload.update({
                    collection: 'users',
                    id: userDoc.id,
                    data: {
                        verificationCode: null,
                        verificationCodeExpires: null,
                        otpAttempts: 0,
                    },
                });
                return res.status(403).json({ message: 'Maximum OTP attempts exceeded. Please request a new code.' });
            }

            return res.status(401).json({ message: 'Invalid verification code.' });
        }

        if (new Date(userDoc.verificationCodeExpires).getTime() < currentTimestamp) {
            return res.status(401).json({ message: 'Verification code has expired.' });
        }

        // delete OTP and reset otpAttempts
        await payload.update({
            collection: 'users',
            id: userDoc.id,
            data: {
                verificationCode: null,
                verificationCodeExpires: null,
                otpAttempts: 0,
            },
        });

        const cookieKey = 'payload-token';
        const cookieValue = req.session.tempToken; // Use the temporary token
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000, // 1 hour
        };

        req.session.tempUser = null;
        req.session.tempToken = null;
        res.cookie(cookieKey, cookieValue, cookieOptions);
        return res.status(200).json({ token: cookieValue });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        return res.status(500).json({ message: 'An error occurred during OTP verification.' });
    }
};