const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
        email: {
          type: String, 
          required: true 
        },
        token: {
         type: String,
          required: true 
        },
        expiration: { 
        type: Date, 
        required: true 
        }
});

module.exports=mongoose.model('PasswordReset', passwordResetSchema);
