require('dotenv').config(); 

const mongoose = require('mongoose');
const User = require('./models/User');
const Budget = require('./models/Budget'); // Ensure the path is correct relative to dbHelpers.js


require('./models/User');  
require('./models/Budget');


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connection successful'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });


const getUserByUsername = async (username) => {
    try {
        return await User.findOne({ username: username }).exec();  
    } catch (error) {
        console.error('Error finding user by username:', error.message);
        throw error;
    }
};


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

const getBudgetByUsername = async (username) => {
    const user = await User.findOne({ username: username }).populate('budgets').exec();
    return user ? user.budgets : null;  // Return populated budgets or null if no user is found
};



const updateBudget = async (username, budgetItems) => {
    try {
        // Find the user first
        const user = await User.findOne({ username: username });

        if (!user) {
            throw new Error('User not found');
        }
        for (let item of budgetItems) {
            
            const budget = new Budget(item); 
            await budget.save();
            user.budgets.push(budget._id);
        }
        await user.save();

        return user.budgets; 
    } catch (error) {
        console.error('Error updating budget:', error.message);
        throw error;
    }
};



module.exports = { getUserByUsername, addUser, getBudgetByUsername, updateBudget };
