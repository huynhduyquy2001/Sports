import type { Access } from 'payload/types'
import { checkRole } from '../../Users/checkRole'
const isBookingRead: Access = ({ req: { user } }) => {
    if (user) {
        if (checkRole(['admin'], user)) {
            return true
        }

        return {
            user: {
                equals: user.id,
            }
        }
    }
    return false
}

export default isBookingRead
