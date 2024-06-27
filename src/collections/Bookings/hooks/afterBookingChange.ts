import payload from 'payload';
import { AfterChangeHook } from 'payload/dist/collections/config/types';
import { generateSignature } from '../../../utils/generateSignature';

export const afterBookingChange: AfterChangeHook = async ({ doc, req, operation }) => {
    if (operation === 'create') {
        try {
            let courtID;

            // Kiểm tra nếu doc.court là một đối tượng với trường id
            if (typeof doc.court === 'object' && doc.court.id) {
                courtID = doc.court.id;
            } else if (typeof doc.court === 'string') {
                // Nếu doc.court là một chuỗi, giả định đó là UUID
                courtID = doc.court;
            } else {
                throw new Error("Invalid court information");
            }


            // Tìm kiếm thông tin court
            const court = await payload.findByID({
                collection: 'courts',
                id: courtID,
                overrideAccess: true,
                showHiddenFields: true,
            });

            // Kiểm tra nếu court và checksumKey tồn tại
            if (!court || !court.checksumKey) {
                throw new Error("Checksum key not found");
            }

            const checksumKey = court.checksumKey;

            // Tạo chữ ký dựa trên dữ liệu booking
            const signature = generateSignature(doc, checksumKey);

            // Cập nhật trường signature cho bản ghi vừa tạo
            await payload.update({
                collection: 'bookings',
                id: doc.id,
                data: {
                    signature,
                },
                overrideAccess: true, // Thêm overrideAccess nếu cần thiết
            });
        } catch (error) {
            console.error("Error generating signature: ", error);
            throw new Error("Internal server error: " + error.message);
        }
    }

    return doc;
};
