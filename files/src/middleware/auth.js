export function auth (req, res, next){
    if (req.session?.usuario || req.session?.admin ) {
        return next()
    }
    return res.status(401).send('Inicie Sesion')
}

export function authValidation (req, res, next){
    const { email, password } = req.body

    if (email == '' || password == '') {
        return res.status(401).send('Complete todos los campos')
    }
    return next()
}