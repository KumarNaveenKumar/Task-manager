const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Mike',
  age: 22,
  email: 'mike@example.com',
  password: '56what!!',
  tokens: [{
    token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
  }]
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

afterAll(async () => { 
    await mongoose.connection.close()
})

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Ankit',
      age: 22,
      email: 'ankit@example.com',
      password: 'Pywassmord$782'
    }).expect(201);

    // Assert that the database is changed correctly
        const user = await User.findById(response.body.user._id);
        expect(user).not.toBeNull();

    // Asserttions about response
        expect(response.body).toMatchObject({
          user: {
            name: 'Ankit',
            email: 'ankit@example.com',
          },
          token: user.tokens[0].token
        });
        expect(user.password).not.toBe('Pywassmord$782')
});

test('Should login existing user', async () => {
      const response = await request(app).post('/users/login').send({
      email: userOne.email,
      password: userOne.password,
    }).expect(200);
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
      email: userOne.email,
      password: 'wrongPasswprd!123'
  }).expect(400);
});

test('Should get profile for authorized user', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
});

test('should not get profile for unauthorized user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
});

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
        const user = await User.findById(userOneId);
        expect(user).toBeNull();
});

test('Should not delete account for unauthorized user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
});

test('Should upload avatar image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profilepic.jpg')
        .expect(200);
    const user = await User.findById(userOneId)
    // two objetcs are not equal (===) even if they have exactly same properties
    // expect({}).toEqual({})
    expect(user.avatar).toEqual(expect.any(Buffer))
});

test('Should update valid User fields', async() => {
        await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
              name: 'Jess'
            })
            .expect(200);
        const user = await User.findById(userOneId);
        expect(user.name).toEqual('Jess');
});

test('Should not update valid User fields', async() => {
        await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
              location: 'The Bahamas'
            })
            .expect(400);
});

