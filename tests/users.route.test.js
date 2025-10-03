const supertest = require('supertest')
const app = require('../app');
const {connectInstance} = require('./database')

describe("Testing User Route", () => {
    let database;

    beforeAll(async () => {
        database = await connectInstance();
    });

    afterEach(async () => {
        await database.clear()
    });

    afterAll(async () => {
        await database.disconnect()
    });

    it("should signup successfully", async () => {
        const response = await supertest(app).post('/api/v1/users/signup').send({
            first_name: "LC",
            last_name: "Adesoji",
            email: "LC@gmail.com",
            password: "passworded"
        })
        expect(response.status).toEqual(201)
        expect(response.body.message).toEqual('User created successfully')
    })


    it("should fail to signup", async () => {
        const response = await supertest(app).post('/api/v1/users/signup').send({
            first_name: "LC",
            email: "LC@gmail.com",
            password: "passworded"
        })
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual('\"last_name\" is required')
    })
    
})
