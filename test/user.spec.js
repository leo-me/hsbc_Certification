
const app = require('../src/app');
const supertest = require('supertest');
const assert = require("assert");

const agent = supertest(app);

test('testing add a user', async() => {
    agent.get("/work")
        .expect(200)
        .expect(function(res)
        {
            assert.equal(res.text, "welcome to work!");
        })
        .end();
});


test('testing add exsisting user', async() => {

});

test('testing delete a user', async() => {

});

test('testing delete a non-existent user', async() => {

});

