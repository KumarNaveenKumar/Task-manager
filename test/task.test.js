const request = require('supertest');
const app = require('../src/app')
const Task = require('../src/models/task');
const { userOneId, userOne, setUpDatabase } = require('./fixtures/db');

beforeEach(setUpDatabase);

test('should create a new task for user', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.token[0].token}`)
    .send({
        description : 'From my test'
    })
    .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.complete).toEqual(false)
})