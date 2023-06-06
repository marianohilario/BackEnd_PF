export function userVali (req, res, next){
    const { first_name, last_name, age, role = 'user', email, password } = req.body

    if (first_name == '' || last_name == '' || age == '' || role == '' || email == '' || password == '') {
        return res.status(401).send('Complete todos los campos')
    }
    return next()
}