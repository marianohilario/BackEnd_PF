import ProductsService from "../services/productsService.js"
const productsService = new ProductsService

export function rollVerify(req, res, next) {
    if (req.user.roll === 'Admin' || req.user.roll === 'premium') {
        return next()
    }
    return res.status(401).send('Usted no es administrador o usuario premium')
}

export function rollUserVerify(req, res, next) {
    if (req.session?.usuario) {
        return next()
    }
    return res.status(401).send('Usted no es usuario')
}

export async function rollPremiumVerify(req, res, next) {
    console.log(req.params);
    let pid = req.params.pid
    let product = await productsService.getProductById(pid)
    console.log(product);
    if (req.session.roll === 'premium' && req.session.email === product.owner) return res.status(401).send('Usted no puede adquirir su propio producto')
    return next()
}

export async function rollDeleteVerify(req, res, next) {
    let pid = req.body.productDeleteId
    let product = await productsService.getProductById(pid)
    switch (req.session.roll) {
        case "Admin": {
            return next()
        }
        case "premium": {
            if (req.session.email === product.owner) {
                return next()
            } else {
                res.status(401).send('Usted no tiene permisos para eliminar productos que no son de su catálogo')
                break
            }
        }
        default: {
            return res.status(401).send('Usted no tiene permisos')
        }
    }
}