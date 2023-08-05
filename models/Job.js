const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    position: {
        type: String,
        required: [true, 'Please provide position name.'],
        maxlength: 50
    },
    company: {
        type: String,
        required: [true, 'Please provide company name.'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'pending', 'declined'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide an user.']
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);