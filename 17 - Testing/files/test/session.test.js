import mongoose from 'mongoose'
import SessionsService from '../src/services/sessionsService.js'
import chai from 'chai'
import supertest from 'supertest'
import config from '../src/config/config.js'

mongoose.connect(config.mongoUrl)

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing Sessions Dao', ()=>{
    before(function(){
        this.sessionsService = new SessionsService
    })
    beforeEach(function(){
        this.timeout(5000)
    })
    it('Nuestro dao debe poder obtener un usuario por email', async function(){
        let UserMock = {
            username: 'marianohilario@gmail.com',
            password: 'asd123'
        }
        const {
            _body
        } = await requester.post('/auth/login').send(UserMock)
        expect(typeof _body, 'object').to.be.ok
    })
    it('Nuestro dao debe poder cambiar de contraseña', async function(){
        let UserMock = {
            email: 'm@m.com',
            password: 'meh123'
        }
        const {
            _body
        } = await requester.post('/api/users/changePassword').send(UserMock)
        expect(typeof _body, 'object').to.be.ok
    })
    it('Nuestro dao debe poder cambiar de roll', async function(){
        const {
            _body
        } = await requester.get('/api/users/premium/6449e1680c65d5991d782610')
        expect(typeof _body, 'object').to.be.ok
    })
})