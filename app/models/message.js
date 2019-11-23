const mongoose = require('mongoose');
const dbUrl = require('../../config/database').url
mongoose.set('useUnifiedTopology', true);
mongoose.connect(dbUrl, { useNewUrlParser: true, useFindAndModify: false } , (err) => console.log('mongodb connected',err))

let messageSchema = mongoose.Schema({
    name : {
        type: String,
        required: true},
    message : {
        type: String,
        required: true}
});

module.exports = mongoose.model('Message', messageSchema);