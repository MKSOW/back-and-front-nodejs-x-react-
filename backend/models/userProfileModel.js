const { required } = require('joi');
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.schema ({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    address: { type: string, required: true},
    phoneNumber:{ type: string, required: true},
},{ Timestamp: true});

module.exports = mongoose.model('UserProfile', userProfileSchema);