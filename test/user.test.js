const app = require('../src/app')
const request = require('supertest')



test('Should signup a new user', async () => {

    try {
        await request(app).post('/users').send({
            name: 'Naveen',
            email: 'naveenchaudharyyyy@gmail.com',
            password: 'Naveen@123'
        }).expect(201)
    } catch(error) {
        console.log(error)
    }
})