const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            required: true,
            default: 0,
            validate(value) {
                if (value < 18) throw new Error('Age must be a positive number.')
            }
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid!')
            }
        }
        },
        password: {
            type: String,
            required: true,
            minLength: 7,
            trim: true,
            validate(value) {
                if (value.toLowerCase().includes('password')) throw new Error(`You cannot use "${value}" as your password.`);
            }
        },
        tokens: [{
            token: { 
                type: String,
                required: true 
            }
        }],
        avatar: {
            type: Buffer
        }
    }, {
        timestamps: true

    }
    );


    // To relate user to tasks 
    userSchema.virtual('tasks', {
        ref: 'task',
        localField: '_id',
        foreignField: 'owner'
    })

    // To hide password, login tokens and avatars etc from the user response
    userSchema.methods.toJSON = function () {
        const user = this;
        const userObject = user.toObject();

        delete userObject.password;
        delete userObject.tokens;
        delete userObject.avatar;

        return userObject;
    };
// To create auth token using jwt
    userSchema.methods.generateAuthToken = async function () {
        const user = this;
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

        user.tokens = user.tokens.concat({ token })
        await user.save();

        return token;
    };

    userSchema.statics.findByCredentials = async (email, password) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Unable to login');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Unable to login');
        }

        return user;
    };

// Hash the plain text password before saving
    userSchema.pre('save', async function (next) {
        const user = this;
        
        console.log('Just before saving :P');

        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8)
        }

        next()
    });

// To delete all the tasks related to a user when that user is deleted.

userSchema.pre('remove', async function (next){
    const user = this
    await Task.deleteMany({ owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;

