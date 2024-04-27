const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }  // No unique constraint
});

const Budget = mongoose.model('Budget', BudgetSchema);
module.exports = Budget;
