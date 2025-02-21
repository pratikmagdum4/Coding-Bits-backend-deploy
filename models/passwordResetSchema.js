import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('PasswordReset', passwordResetSchema);
