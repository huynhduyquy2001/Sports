import express from "express";
import payload from "payload";
import { checkRole } from "../checkRole";
import adminsAndUser from "../access/adminsAndUser";
import { PaginatedDocs } from "payload/database";
import { Booking } from "payload/generated-types";

export const getBookings = async (req: express.Request, res: express.Response) => {

    const user: any = req.user;
    const { page, limit } = req.query;
    let bookings: PaginatedDocs<Booking>
    console.log(user.id)
    if (checkRole(user)) {
        bookings = await payload.find({
            collection: "bookings",
            where: {
                userId: user.id
            },
            sort: "-createdAt",
            limit: Number(limit),
            page: Number(page)
        });
    } else {
        bookings = await payload.find({
            collection: "bookings",
            where: {
                user: {
                    equals: user.id,
                }
            },
            sort: "-createdAt",
            limit: 10,
            page: Number(page)
        });
    }

    return res.status(200).json({ bookings: bookings });
};