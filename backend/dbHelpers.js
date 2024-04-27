require('dotenv').config();
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

        // Log the existing budgets before making changes
        console.log('Existing budgets before update:', user.budgets);

        for (let item of budgetItems) {
            // Check if _id is provided, indicating this is an edit
            if (item._id) {
                // Attempt to delete the old budget item
                const deleteResult = await Budget.findByIdAndDelete(item._id);
                console.log('Deleted budget item:', deleteResult);

                // Verify deletion was successful before continuing
                if (!deleteResult) {
                    console.error('Failed to delete budget item with _id:', item._id);
                    // If deletion was not successful, skip this iteration
                    continue;
                }

                // If successful, remove the _id from the user's budget array
                user.budgets = user.budgets.filter(budgetId => !budgetId.equals(item._id));
            }

            // Create and save the new budget item
            const budget = new Budget({ ...item, user: user._id });
            const saveResult = await budget.save();
            console.log('Created new budget item:', saveResult);

            // Push the new budget _id to the user's budgets array
            user.budgets.push(budget._id);
        }

        // Save changes to the user
        const saveUserResult = await user.save();
        console.log('Updated user with new budgets:', saveUserResult);

        // Optionally repopulate and return the updated budgets
        await user.populate('budgets').execPopulate();
        return user.budgets; 
    } catch (error) {
        console.error('Error updating budget:', error.message);
        throw error;
    }
};


// Export helper functions
module.exports = { getUserByUsername, addUser, getBudgetByUsername, updateBudget };
