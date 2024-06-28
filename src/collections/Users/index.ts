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
import { login } from './endpoints/login'
import { sendOtp } from './endpoints/sendOTP'
import { verifyOTP } from './endpoints/verifyOTP'
import { getCurrentUser } from './endpoints/getCurrentUser'
import { getBookings } from './endpoints/getBookings'
import { BeforeChangeHook } from 'payload/dist/collections/config/types'

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
const beforeUserChange: BeforeChangeHook = async ({ data, req, originalDoc, operation }) => {
    if (operation === 'update' || operation === 'create') {
        if (!data.avatar) {
            data.avatar = '4624dba7-a816-4d14-b7e0-7fb44221296a'
        }
    }
}
const Users: CollectionConfig = {
    slug: 'users',
    auth: {
        useAPIKey: true,
    },
    admin: {
        useAsTitle: 'email',
    },
    access: {
        read: () => true,
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
        {
            path: '/bookings',
            method: 'get',
            handler: getBookings,
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
            type: 'relationship',
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
        beforeChange: [beforeUserChange]
    },
}

export default Users