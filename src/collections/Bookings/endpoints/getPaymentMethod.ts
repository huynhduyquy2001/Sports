import { Request, Response, NextFunction } from 'express';
import payload from 'payload';
import axios from 'axios';

export const getPaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const globalSettings = await payload.findGlobal({ slug: 'settings' });
        console.log(globalSettings.paymentApi)
        const paymentApi = globalSettings.paymentApi;
        const apiKey = globalSettings.apiKey;
        const channelId = globalSettings.channelId;

        // Thực hiện yêu cầu HTTP đến paymentApi với headers
        const response = await axios.get(
            paymentApi,
            {
                headers: {
                    'x-api-key': apiKey,
                    'x-channel-id': channelId,
                },
            }
        );

        // Trả về phản hồi từ paymentApi
        res.status(200).json(response.data);
    } catch (error) {
        // Bắt lỗi và chuyển đến middleware xử lý lỗi
        next(error);
    }
};
