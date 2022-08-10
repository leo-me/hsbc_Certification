const app = require('../src/app');
const supertest = require('supertest');
const assert = require('assert');
const config = require('../src/config');
const Cryptr = require('cryptr');

const agent = supertest(app);

const cryptr = new Cryptr(config.cryptrKey);
const token = cryptr.encrypt(`adam-${Date.now() + 2*60*60*1000}`);


test('testing user can login with right name and password', async() => {
    await agent.post('/login')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send({
            username: 'adam',
            password: cryptr.encrypt('bacon'),
        })
        .expect(200)
        .expect((response) => {
            assert.equal(response.text, 'login success');
        });
});


test('testing user can not login with wrong name', async() => {
    await agent.post('/login')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send({
            username: 'adam11',
            password:  cryptr.encrypt('bacon'),
        })
        .expect(400)
        .expect((response) => {
            assert.equal(response.text, 'login fail, please check your name or password');
        });

});


test('testing user can not login with wrong password', async() => {
    await agent.post('/login')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        username: 'adam',
        password: '111',
    })
    .expect(400)
    .expect((response) => {
        assert.equal(response.text, 'please check your input');
    });
});



test('testing user can not login with empty name and password', async() => {
    await agent.post('/login')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        username: '',
        password: '',
    })
    .expect(403)
    .expect((response) => {
        assert.equal(response.text, 'missing parameter');
    });
});

// The test cases for the two methods（checkTokenValid 、invalidate） are left unwritten here