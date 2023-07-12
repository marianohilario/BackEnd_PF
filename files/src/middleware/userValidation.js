export function userValidation (req, res, next){
    console.log('userValidation', req.body);
    const { first_name, last_name, age, email, password, confirm_password } = req.body

    let errors = [];

    if (first_name === '' || last_name === '' || age === '' || email === '' || password === '' || confirm_password === '') {
        return res.status(401).send('Fill in all fields')
    }

    if (password.length < 4) {
      errors.push({ text: "Passwords must be at least 4 characters." });
    }
    
    if (password !== confirm_password) {
        errors.push({ text: "Passwords do not match." });
    }

    if (errors.length > 0) {
        return res.render("auth/register", {
          errors,
          first_name,
          last_name,
          age,
          email,
          password,
          confirm_password,
        });
      }
    

    return next()
}