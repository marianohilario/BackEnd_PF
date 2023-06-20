export function validation (req, res, next){
    const newItem = req.body

    if (!newItem.title || !newItem.description || !newItem.price || !newItem.thumbnail || !newItem.code || !newItem.stock || !newItem.category) {
        return res.send({mensaje: 'No puede dejar campos sin completar'})
    }
    return next()
}