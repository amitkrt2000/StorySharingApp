const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Story',
        },
    ],
    likedSlides: [
        {
            storyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Story',
                required: true,
            },
            slideIndex: {
                type: Number,
                required: true, // index of the liked slide within the story
            },
        },
    ],
    downloadedSlides: [
        {
            storyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Story',
                required: true,
            },
            slideIndex: {
                type: Number,
                required: true, // index of the downloaded slide within the story
            },
        },
    ],
    createdStories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Story',
        },
    ],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
