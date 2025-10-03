const supertest = require('supertest')
const app = require('../app');

describe('home route', () => {
    it('should return 200', async () => {
        const response = await supertest(app).get('/');
        expect(response.statusCode).toEqual(200)
        
    })
})