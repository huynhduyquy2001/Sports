import { Novu } from "@novu/node"
import express from "express"
import payload from "payload"

export const sendOtp = async (req: express.Request, res: express.Response) => {
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