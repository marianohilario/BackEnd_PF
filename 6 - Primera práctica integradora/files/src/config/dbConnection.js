import { connect } from "mongoose"

const URL = 'mongodb+srv://marianohilario:va09santi30@cluster0.fdy8vrg.mongodb.net/ecommerce?retryWrites=true&w=majority'

const dbConnection = async () => {
    return await connect(URL, error => {
        if (error) {
            console.log('No se puede conectar a la base de datos: ' + error);
            process.exit()
        }
        console.log('Conectado a Mongodb');
    })
}

export default dbConnection