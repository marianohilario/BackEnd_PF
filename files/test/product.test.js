import mongoose from 'mongoose'
import ProductsService from '../src/services/ProductsService.js'
import chai from 'chai'
import supertest from 'supertest'
import config from '../src/config/config.js'

mongoose.connect(config.mongoUrl)

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing Products Dao', ()=>{
    before(function(){
        this.productsService = new ProductsService
    })
    beforeEach(function(){
        this.timeout(5000)
    })
    it('Nuestro dao debe poder obtener todos los productos de la db', async function(){
        const {
            _body
        } = await requester.get('/api/products')
        expect(Array.isArray(_body)).to.be.ok
    })
    it('Nuestro dao debe poder obtener un unico producto', async function (){
        const {
            _body
        } = await requester.get('/api/products/649f4a7b777c6db10681d034')
        expect(typeof _body, 'object').to.be.ok
    })
})