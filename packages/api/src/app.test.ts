import request from 'supertest';
import app from './app';

describe("GraphQL endpoint" , () => {

    describe("hero query", () => {
        it("should return a 200 with hero when given valid ID", async () => {
            await request(app)
              .post('/graphql')
              .set('Accept', 'application/json')
              .send({ query: `{ hero(id: "16639") { id } }`, variables: null })
              .expect(200, {
                  data: {
                      hero: { id: "16639" }
                  }
              });
         });
    });
    
});