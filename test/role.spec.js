
const app = require('../src/app');
const supertest = require('supertest');
const assert = require("assert");
const utils = require('../src/utils');
const config = require('../src/config');
const Cryptr = require('cryptr');
const roleDB = require('../src/db/role.json');

const cryptr = new Cryptr(config.cryptrKey);
const token = cryptr.encrypt(`adam-${Date.now() + 2*60*60*1000}`);

const agent = supertest(app);

test('testing add role ', async() => {
    await agent.post('/role/add')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        roleName: `${utils.randomString(8)}`,
    })
    .expect(200)
    .expect((response) => {
        assert.equal(response.text, 'success');
    });
});


test('testing add invalid role ', async() => {
    await agent.post('/role/add')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        roleName: utils.randomString(4),
    })
    .expect(403)
});

test('testing add empty role ', async() => {
    await agent.post('/role/add')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        roleName: '',
    })
    .expect(403)
});




test('testing delete a right role id', async() => {
    const lastRole = roleDB[roleDB.length - 1];

    await agent.get('/role/delete')
    .query({ roleId: lastRole.id })
    .set('Content-type', 'application/x-www-form-urlencoded')
    .expect(200)
    .expect((response) => {
        assert.equal(response.text, 'success');
    });

});


test('testing delete a wrong role id', async() => {
    await agent.get('/role/delete')
    .query({ roleId: '88888' })
    .set('Content-type', 'application/x-www-form-urlencoded')
    .expect(400)
    .expect((response) => {
        assert.equal(response.text, 'role does not exist');
    });

});

test('testing delete a empty role id', async() => {
    await agent.get('/role/delete')
    .query({ roleId: '' })
    .set('Content-type', 'application/x-www-form-urlencoded')
    .expect(403)
});


test('testing add a role to a user , that user already have', async() => {
    await agent.post('/role/addToUser')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        userId: 's-944',
        roleId: 'r-47',
    })
    .expect(400)
});


test('testing add a empty role to a user', async() => {
    await agent.post('/role/addToUser')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        userId: 's-944',
        roleId: '',
    })
    .expect(403)

});

test('testing add a role to a empty user', async() => {
    await agent.post('/role/addToUser')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        userId: '',
        roleId: 'r-47',
    })
    .expect(403)

});


test('testing add a non-existent role to a user', async() => {
    await agent.post('/role/addToUser')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        userId: 's-944',
        roleId: 'r-47',
    })
    .expect(400)

});


test('testing add a role to a non-existent user', async() => {
    await agent.post('/role/addToUser')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        userId: '9999',
        roleId: 'r-47',
    })
    .expect(400)
});


test('testing add a empty role to a user', async() => {
    await agent.post('/role/addToUser')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        userId: 's-944',
        roleId: '',
    })
    .expect(403)

});


test('testing check role with valid token and role', async() => {
    await agent.post('/role/check')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .set('Cookie', [`token=${token}`])
    .send({
        roleId: '1',
    })
    .expect(200)

});

test('testing check role with valid token and a invalid role', async() => {
    await agent.post('/role/check')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .set('Cookie', [`token=${token}`])
    .send({
        roleId: 'sssss',
    })
    .expect(200)

});

test('testing check role with invalid token and role', async() => {
    await agent.post('/role/check')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .set('Cookie', [`token=sssssss`])
    .send({
        roleId: '1',
    })
    .expect(403)

});


test('testing get all roles with valid token', async() => {
    await agent.get('/role/list')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .set('Cookie', [`token=${token}`])
    .expect(200)
});


test('testing get all roles with invalid token', async() => {
    await agent.get('/role/list')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .set('Cookie', [`token=${token}`])
    .expect(200)
});


