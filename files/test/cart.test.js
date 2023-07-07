import mongoose from 'mongoose'
import CartsService from '../src/services/cartsService.js'
import chai from 'chai'
import supertest from 'supertest'
import config from '../src/config/config.js'

mongoose.connect(config.mongoUrl)

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing Carts Dao', ()=>{
    before(function(){
        this.cartsService = new CartsService
    })
    beforeEach(function(){
        this.timeout(5000)
    })
    it('Nuestro dao debe poder crear un carrito nuevo', async function(){
        const {
            _body
        } = await requester.post('/api/carts')

        // console.log(_body.payload)
        expect(typeof _body.payload, 'object').to.be.ok
    })
    it('Nuestro dao debe poder agregar productos al carrito', async function(){
        const {
            _body
        } = await requester.post('/api/carts/64997d00918c1422b3bbebeb/product/649f4a7b777c6db10681d034')

        console.log(_body)
        //expect(typeof _body, 'object').to.be.ok
    })
    it('Nuestro dao debe poder eliminar productos del carrito', async function(){
        const {
            _body
        } = await requester.delete('/api/carts/64997d00918c1422b3bbebeb/product/649f4a7b777c6db10681d034')

        console.log(_body)
        expect(typeof _body.data, 'object').to.be.ok
    })
})