
const app = require('../src/app');
const supertest = require('supertest');
const assert = require("assert");

const agent = supertest(app);

test('testing user can login with right name and password', async() => {

});


test('testing user can not login with wrong name', async() => {

});


test('testing user can not login with wrong password', async() => {

});



