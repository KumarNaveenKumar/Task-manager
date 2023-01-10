const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/task');

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


const setUpDatabase = async () => {
    await User.deleteMany();
    await new User(userOne).save();
}

afterAll(async () => { 
    await mongoose.connection.close()
})
module.exports = {
    userOneId,
    userOne,
    setUpDatabase
}