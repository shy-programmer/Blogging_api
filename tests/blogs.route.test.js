const supertest = require('supertest')
const app = require('../app');
const {connectInstance} = require('./database')

describe("Testing User Route", () => {
    let database;
    let token1;
    let token2;
    let testBlog1;
    let testBlog2;

    beforeAll(async () => {
        database = await connectInstance();

        const testUser1 = await supertest(app).post('/api/v1/users/signup').send({
            first_name: "LC",
            last_name: "Arowolo",
            email: "LC@gmail.com",
            password: "passworded"
        })
        token1 = testUser1.body.data.token;

        const testUser2 = await supertest(app).post('/api/v1/users/signup').send({
            first_name: "Daniel",
            last_name: "Adesoji",
            email: "Dan@gmail.com",
            password: "passworded2"
        })
        token2 = testUser2.body.data.token;

        testBlog1 = await supertest(app)
        .post('/api/v1/blogs')
        .set("Authorization", `Bearer ${token1}`)
        .send({
            title: "This is a test blog",
            body: "This is just to test that the api works well",
        })

        await supertest(app)
        .put(`/api/v1/blogs/${testBlog1.body.data._id}/publish`)
        .set("Authorization", `Bearer ${token1}`)

        testBlog2 = await supertest(app)
        .post('/api/v1/blogs')
        .set("Authorization", `Bearer ${token2}`)
        .send({
            title: "This is a second test blog",
            body: "This is just to test api authorizations",
        })
        
        await supertest(app)
        .put(`/api/v1/blogs/${testBlog2.body.data._id}/publish`)
        .set("Authorization", `Bearer ${token2}`)
    });


    afterAll(async () => {
        await database.disconnect()
    });

    it("should get blog list without authorization", async () => {
        const response = await supertest(app).get('/api/v1/blogs')
        expect(response.status).toEqual(200)
        expect(response.body.message).toEqual('Published blogs retrieved successfully')
    })

    it("should get a users blogs for them", async () => {
        const response = await supertest(app)
            .get(`/api/v1/blogs/user`)
            .set("Authorization", `Bearer ${token2}`)
            
        expect(response.status).toEqual(200)
        expect(response.body.message).toEqual('User blogs retrieved successfully')
    })

    it("should fail to edit another users blog", async () => {
        const response = await supertest(app)
            .put(`/api/v1/blogs/${testBlog2.body.data._id}`)
            .set("Authorization", `Bearer ${token1}`)
            .send({
                title: "here is a new title that shouldn't work"
            })
        expect(response.status).toEqual(404)
        expect(response.body.message).toEqual('Blog not found or you are not the author')
    })

    it("should let a user delete their blog", async () => {
        const response = await supertest(app)
            .delete(`/api/v1/blogs/${testBlog2.body.data._id}`)
            .set("Authorization", `Bearer ${token2}`)
        expect(response.status).toEqual(200)
        expect(response.body.message).toEqual('Blog deleted successfully')
    }) 
})
