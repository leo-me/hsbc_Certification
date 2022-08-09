
const app = require('../src/app');
const supertest = require('supertest');
const assert = require("assert");

const agent = supertest(app);

test('testing user can work', async() => {
    agent.get("/work")
        .expect(200)
        .expect(function(res)
        {
            assert.equal(res.text, "welcome to work!");
        })
        .end();
});
