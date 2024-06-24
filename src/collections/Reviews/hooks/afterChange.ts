import payload from 'payload';
import { AfterChangeHook } from 'payload/dist/collections/config/types';

export const afterReviewChange: AfterChangeHook = async ({ doc, req, operation }) => {
    const partnerID = doc.partner;

    if (operation === 'create' || operation === 'update') {
        try {
            // Tính toán lại averageRating và ratingCount
            const reviews = await payload.find({
                collection: 'reviews',
                where: {
                    partner: {
                        equals: partnerID,
                    },
                },
            });

            const totalReviews = reviews.totalDocs;
            const totalRating = reviews.docs.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            // Cập nhật thông tin đối tác
            await payload.update({
                collection: 'partners',
                id: partnerID,
                data: {
                    averageRating,
                    ratingCount: totalReviews,
                },
            });

        } catch (error) {
            console.error('Error updating partner ratings:', error);
        }
    }
};
