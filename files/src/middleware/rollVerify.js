export function rollVerify(req, res, next) {
    console.log('rollVerify: ', req.user.roll)
    if (req.user.roll === 'Admin' || req.user.roll === 'premium') {
        return next()
    }
    return res.status(401).send('Usted no es admin')
}

export function rollUserVerify(req, res, next) {
    if (req.session?.usuario) {
        return next()
    }
    return res.status(401).send('Usted no es usuario')
}

export function rollPremiumVerify(req, res, next) {
    if (req.session?.premium) return res.status(401).send('Usted no puede adquirir su propio producto')
    return next()
}

export function rollDeleteVerify(req, res, next) {
    if (req.session?.admin) return next()
    if (req.session?.premium) return next()
    return res.status(401).send('Usted no tiene permisos')
}