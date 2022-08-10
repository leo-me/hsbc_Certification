
const app = require('../src/app');
const supertest = require('supertest');
const assert = require('assert');
const userDB = require('../src/db/user.json');

const agent = supertest(app);

test('testing add a valid user', async() => {
    await agent.post('/user/add')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        username: `frank${Math.floor(Math.random()*10000000)}`,
        password: '72dd0179d5479da0cce97c720e8fba579ade68a053787c992e14807c45a9dc1711dcf55b851f895c5c202572f92d4d04016837a2839649e46667cb6de31d379270b7e0f058ee09ef8e0b55f8f6441578868e34d17d0a75ee4890e23d61ef2073df823fc385b20d51a4',
    })
    .expect(200)
    .expect((response) => {
        assert.equal(response.text, 'success');
    });
});


test('testing add exsisting user', async() => {
    await agent.post('/user/add')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        username: 'frank',
        password: '72dd0179d5479da0cce97c720e8fba579ade68a053787c992e14807c45a9dc1711dcf55b851f895c5c202572f92d4d04016837a2839649e46667cb6de31d379270b7e0f058ee09ef8e0b55f8f6441578868e34d17d0a75ee4890e23d61ef2073df823fc385b20d51a4',
    })
    .expect(403)
    .expect((response) => {
        assert.equal(response.text, 'user already exists');
    });
});


test('testing add with empty username', async() => {
    await agent.post('/user/add')
    .set('Content-type', 'application/x-www-form-urlencoded')
    .send({
        username: '',
        password: '72dd0179d5479da0cce97c720e8fba579ade68a053787c992e14807c45a9dc1711dcf55b851f895c5c202572f92d4d04016837a2839649e46667cb6de31d379270b7e0f058ee09ef8e0b55f8f6441578868e34d17d0a75ee4890e23d61ef2073df823fc385b20d51a4',
    })
    .expect(403)
    .expect((response) => {
        assert.equal(response.text, 'missing parameter');
    });
});


test('testing delete a user', async() => {
    const lastRole = userDB[userDB.length - 1];

    await agent.get('/user/delete')
    .query({ userId: lastRole.id })
    .set('Content-type', 'application/x-www-form-urlencoded')
    .expect(200)
    .expect((response) => {
        assert.equal(response.text, 'success');
    });
});

test('testing delete a non-existent user', async() => {
    await agent.get('/user/delete')
    .query({ userId: 'dddd' })
    .set('Content-type', 'application/x-www-form-urlencoded')
    .expect(400)
    .expect((response) => {
        assert.equal(response.text, 'user does not exist');
    });
});


test('testing delete a user with empty userId', async() => {
    await agent.get('/user/delete')
    .query({ userId: '' })
    .set('Content-type', 'application/x-www-form-urlencoded')
    .expect(403)
    .expect((response) => {
        assert.equal(response.text, 'missing parameter');
    });
});


