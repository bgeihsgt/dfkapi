import request from 'supertest';
import app from './app';

describe("GraphQL endpoint" , () => {
    it("should return 200 on a POST", async () => {
       await request(app)
         .post('/graphql')
         .set('Accept', 'application/json')
         .send({ query: "{ hello }", variables: null })
         .expect(200, {
             data: {
                 hello: "Hello world!"
             }
         });
    });
});