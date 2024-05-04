// dbHelpers.js
require('dotenv').config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
  });
  const mongoose = require('mongoose');
  const User = require('./models/User');
  const Budget = require('./models/Budget');
  
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
  });
  


// Get a user by username
const getUserByUsername = async (username) => {
    try {
        return await User.findOne({ username: username }).exec();
    } catch (error) {
        console.error('Error finding user by username:', error.message);
        throw error;
    }
};

// Add a new user
const addUser = async (userData) => {
    const user = new User(userData);
    try {
        await user.save();
        console.log("User added to database:", user);
    } catch (error) {
        console.error("Error adding user to database:", error.message);
        throw error;
    }
};

// Get user's budgets by username
const getBudgetByUsername = async (username) => {
    try {
        const user = await User.findOne({ username: username }).populate('budgets').exec();
        return user ? user.budgets : null;
    } catch (error) {
        console.error('Error retrieving budgets:', error.message);
        throw error;
    }
};

const updateBudget = async (username, budgetItems) => {
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            throw new Error('User not found');
        }

        console.log('Existing budgets before update:', user.budgets);

        for (let item of budgetItems) {
            if (item._id) {
                const deleteResult = await Budget.findByIdAndDelete(item._id);
                console.log('Deleted budget item:', deleteResult);

                if (!deleteResult) {
                    console.error('Failed to delete budget item with _id:', item._id);
                    continue;
                }

                user.budgets = user.budgets.filter(budgetId => !budgetId.equals(item._id));
            }

            const budget = new Budget({ ...item, user: user._id });
            const saveResult = await budget.save();
            console.log('Created new budget item:', saveResult);

            user.budgets.push(budget._id);
        }

        const saveUserResult = await user.save();
        console.log('Updated user with new budgets:', saveUserResult);

        await user.populate('budgets');  // Corrected populate usage
        return user.budgets; 
    } catch (error) {
        console.error('Error updating budget:', error.message);
        throw error;
    }
};



// Export helper functions
module.exports = { getUserByUsername, addUser, getBudgetByUsername, updateBudget };
