import { CollectionConfig } from 'payload/types'
import adminsAndUser from './access/adminsAndUser'
import { checkRole } from './checkRole'
import express from 'express'
import payload from 'payload'
import { Novu } from '@novu/node';
import { admins } from '../access/admins'
import { province } from '../../json/all_VN_province'
import CustomDistrictSelect from './components/CustomDistrictSelect'
import CustomWardSelect from './components/CustomWardSelect'
const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
const login = async (req: express.Request, res: express.Response) => {
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

const sendOtp = async (req: express.Request, res: express.Response) => {
    const email = req.session.tempUser.email
    try {

        // Giả định bạn có một cách để lấy thông tin người dùng từ email
        const user = await payload.find({
            collection: 'users',
            where: {
                email: {
                    equals: email,
                },
            },
        })

        if (!user || !user.docs || user.docs.length === 0) {
            return res.status(404).json({ message: 'User not found' })
        }

        const userId = user.docs[0].id

        // Tạo mã xác thực 6 chữ số
        const code = Math.floor(100000 + Math.random() * 900000)

        // Lưu mã xác thực và thời gian hết hạn vào cơ sở dữ liệu người dùng
        await payload.update({
            collection: 'users',
            id: userId,
            data: {
                verificationCode: code,
                verificationCodeExpires: new Date(Date.now() + 3 * 60 * 1000), // Mã hết hạn sau 10 phút
            },
        })

        const globalSettings: any = await payload.findGlobal({ slug: 'settings' });
        const novu = new Novu(globalSettings.novu.apiKey);
        novu.trigger('otp-notifications', {
            to: {
                subscriberId: userId,
                email: email
            },
            payload: {
                code: code
            }
        });
        console.log('Email sent successfully')
        res.status(200).json({ message: 'OTP sent successfully' })
    } catch (error) {
        console.error('Failed to send email:', error)
        res.status(500).json({ message: error.message })
    }
}
const verifyOTP = async (req: express.Request, res: express.Response) => {
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

const afterUserCreate = async ({ doc, req, operation }: { doc: any, req: any, operation: string }) => {
    if (operation === 'create') {
        try {
            // Lấy thông tin từ Global Settings
            const globalSettings = await req.payload.findGlobal({ slug: 'settings' });
            const novu = new Novu(globalSettings.novu.apiKey);

            // Lấy thông tin từ người dùng mới tạo
            const subscriberId = doc.id;
            const email = doc.email;
            const phone = doc.phone;
            await novu.subscribers.identify(subscriberId, {
                firstName: doc.firstName || "First name",
                lastName: doc.lastName || "Last name",
                email: email,
                phone: phone,
                avatar: doc.avatar || "https://gravatar.com/avatar/553b157d82ac2880237566d5a644e5fe?s=400&d=robohash&r=x",
                locale: doc.locale || "en-US",
                data: {
                    isDeveloper: doc.isDeveloper || false,
                    customKey: doc.customKey || "customValue"
                }
            });
        } catch (error) {
            console.error('Error fetching global settings or identifying subscriber:', error);
        }
    }
};

const Users: CollectionConfig = {
    slug: 'users',
    auth: {
        useAPIKey: true,
    },
    admin: {
        useAsTitle: 'email',
    },
    access: {
        read: adminsAndUser,
        create: admins,
        update: adminsAndUser,
        delete: admins,
        //admin: ({ req: { user } }) => checkRole(['admin'], user),
    },
    endpoints: [
        {
            path: '/send-otp',
            method: 'post',
            handler: sendOtp,
        },
        {
            path: '/currentUser',
            method: 'get',
            handler: getCurrentUser,
        },
        {
            path: '/login',
            method: 'post',
            handler: login,
        },
        {
            path: '/verify-otp',
            method: 'post',
            handler: verifyOTP,
        },

    ],
    fields: [
        {
            name: 'name',
            type: 'text',
        },
        {
            name: 'phoneNumber',
            type: 'text',
        },
        {
            name: 'avatar',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'dateOfBirth',
            type: 'date',
        },
        {
            name: 'gender',
            type: 'radio',
            options: [
                {
                    label: 'Male',
                    value: 'male',
                },
                {
                    label: 'Female',
                    value: 'female',
                },
                {
                    label: 'Other',
                    value: 'other',
                },
            ],
        },
        {
            name: 'province_id',
            type: 'select',
            label: 'Province',
            options: province.map((province: { Name: string; Code: string }) => ({
                label: province.Name,
                value: province.Code
            })),
            admin: {
                description: 'Select the province from the list.',
            },
        },
        {
            name: 'district_id',
            type: 'text', // Chuyển đổi thành kiểu text
            label: 'District',
            admin: {
                components: {
                    Field: CustomDistrictSelect,
                },
            },
        },
        {
            name: 'ward_id',
            type: 'text', // Chuyển đổi thành kiểu text
            label: 'Ward',
            admin: {
                components: {
                    Field: CustomWardSelect,
                },
            },
        },
        {
            name: 'verificationCode',
            type: 'number',
            admin: {
                readOnly: true,
            },
            access: {
                update: ({ req: { user } }) => { return false },
            },
            hidden: true,
        },
        {
            name: 'verificationCodeExpires',
            type: 'date',
            admin: {
                readOnly: true,
            },
            access: {
                update: ({ req: { user } }) => { return false },
            },
            hidden: true,
        },
        {
            name: 'otpAttempts',
            type: 'number',
            defaultValue: 0,
            hidden: true,
            access: {
                update: ({ req: { user } }) => { return false },
            },
        },
        {
            name: 'auth2',
            type: 'checkbox',
            label: '2-step authentication',
            defaultValue: false,
        },
        {
            name: 'roles',
            type: 'select',
            hasMany: true,
            defaultValue: ['customer'],
            options: [
                {
                    label: 'admin',
                    value: 'admin',
                },
                {
                    label: 'customer',
                    value: 'customer',
                },
            ],
            access: {
                update: admins
            }
        },
        {
            name: 'accountStatus',
            type: 'radio',
            options: [
                {
                    label: 'Active',
                    value: 'active',
                },
                {
                    label: 'Suspended',
                    value: 'suspended',
                },
                {
                    label: 'Deleted',
                    value: 'deleted',
                },
            ],
            defaultValue: 'active',
            access: {
                read: admins,
                update: admins
            }
        },
    ],
    hooks: {
        afterChange: [afterUserCreate],
    },
}

export default Users