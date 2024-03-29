import { TicketManager } from "../dao/mongo/mongoTicketManager.js";
import logger from "../utils/logger.js";

const ticketManager = new TicketManager();

class TicketService {
  async purchaseTicket(code, purchase_datetime, amount, purchaser) {
    try {
      return await ticketManager.purchaseTicket(
        code,
        purchase_datetime,
        amount,
        purchaser
      );
    } catch (error) {
      logger.error(error);
    }
  }
}

export default TicketService;
