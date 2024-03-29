import ticketModel from '../../models/ticket.js'

export class TicketManager {
    async purchaseTicket (code, purchase_datetime, amount, purchaser) {
        try{
            return await ticketModel.create({code, purchase_datetime, amount, purchaser})
        } catch (error) {
            logger.error(error)
        }
    }
}