import { faker } from '@faker-js/faker'

faker.local = 'es'
export const generateProduct = ()=>{
    return{
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(5),
        price: faker.commerce.price(),
        status: 'true',
        stock: faker.number.int(100),
        category: faker.commerce.department(),
        thumbnail: faker.image.avatar()
    }
}