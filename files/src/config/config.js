import dotenv from 'dotenv'

dotenv.config()

export default {
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    jwtPrivateKey: process.env.JWT_SECRET,
    testMailAdmin: process.env.TEST_MAIL_ADMIN,
    testMailPass: process.env.TEST_MAIL_PASSWORD
}