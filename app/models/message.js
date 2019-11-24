const mongoose = require('mongoose');
const dbUrl = require('../../config/database').url
const moment = require('moment')

mongoose.set('useUnifiedTopology', true);
mongoose.connect(dbUrl, { useNewUrlParser: true, useFindAndModify: false } , (err) => console.log('mongodb connected',err))

let messageSchema = mongoose.Schema({
    name : {
        type: String,
        required: true},
    message : {
        type: String,
        required: true},
    createdAt: {
        type: Date,
        default: moment()
    }
});

module.exports = mongoose.model('Message', messageSchema);