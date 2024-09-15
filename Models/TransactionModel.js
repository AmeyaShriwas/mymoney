const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const transactionSchema = new Schema({
  transactionType: {
    type: String,
    enum: ["Income", "Expenses", "Transfer"],
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    required: false
  },
  date: {
    type: String,
    default: () => moment().format('MM/DD/YYYY'),
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
});

// Pre-save middleware to format the date
transactionSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('date')) {
    this.date = moment(this.date).format('MM/DD/YYYY');
  }
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
