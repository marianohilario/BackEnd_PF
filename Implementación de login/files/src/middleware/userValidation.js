export function userVali (req, res, next){
    const { nombre, apellido, rol = 'user', email, password } = req.body

    if (nombre == '' || apellido == '' || rol == '' || email == '' || password == '') {
        return res.status(401).send('Complete todos los campos')
    }
    return next()
}