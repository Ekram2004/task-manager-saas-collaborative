const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add an organization name"],
    unique: true,
    maxlength:[50, 'Name can not be more than 50 characters']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    createdAt: {
        type: Date,
        default:Date.now
    }
});


module.exports = mongoose.model('Organization', OrganizationSchema);