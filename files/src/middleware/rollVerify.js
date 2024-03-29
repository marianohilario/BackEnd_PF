export function VerifyRollAdminOrPremium(req, res, next) {
    if (req.user.roll === 'Admin' || req.user.roll === 'Premium') {
        return next()
    }
    return res.status(401).send('You are not an administrator or premium user')
}
export function rollPremiumVerify(req, res, next) {
    if (req.user.roll === 'Premium') {
        return next()
    }
    return res.status(401).send('You are not a premium user')
}
export function rollAdminVerify(req, res, next) {
    if (req.user.roll === 'Admin') {
        return next()
    }
    return res.status(401).send('You are not an administrator')
}

export function userLogged(req, res, next) {
    if (req.session?.usuario || req.session?.premium) {
        return next()
    }
    return res.status(401).send('You are not a logged user')
}