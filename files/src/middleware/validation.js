export function validation (req, res, next){
    const newItem = req.body

    if (!newItem.title || !newItem.description || !newItem.price || !newItem.thumbnail || !newItem.code || !newItem.stock || !newItem.category) {
        return res.send({mensaje: 'You must complete all fields'})
    }
    return next()
}