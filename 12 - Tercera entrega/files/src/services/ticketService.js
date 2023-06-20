import { TicketManager } from '../dao/mongo/mongoTicketManager.js'

const ticketManager = new TicketManager

class TicketService {
    async createTicket(code, purchase_datetime, amount, purchaser) {
        try {
            return await ticketManager.createTicket(code, purchase_datetime, amount, purchaser)
        } catch (error) {
            console.log(error);
        }
    }
}

export default TicketService