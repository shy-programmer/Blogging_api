const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: ""
    },
    tags: {
        type: [String],
        default: []
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    read_count: {
        type: Number,
        default: 0,
    },
    reading_time: {
        type: Number,
        default: 0,
    },
    body: {
        type: String,
        required: true,
    },
}, { timestamps: true });

blogSchema.pre('save', function (next) {
    const wordsPerMinute = 200;
    const text = this.body || '';
    const wordCount = text.split(/\s+/).length;
    this.reading_time = Math.ceil(wordCount / wordsPerMinute);
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
