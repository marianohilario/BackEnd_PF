class SessionsController {
    current = async (req, res) =>{

        try {
            res.send(req.user)
        } catch (error) {
            req.logger.error(error)
        }
    }
}

export default SessionsController