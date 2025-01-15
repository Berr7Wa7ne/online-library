const prisma = require("../models/prisma.js");

// Function to handle book checkout
const checkOutBook = async (req, res) => {
    try {
        // Destructure request body to get book ID and expected check-in date
        const { bookId, expectedCheckinDate } = req.body;

        // Assume the user is authenticated and their ID is available in the request
        const userId = req.user.id;

        console.log("Checkout request received:", { userId, bookId, expectedCheckinDate });

        // Step 1: Ensure the book is not already checked out
        console.log("Checking if the book is already checked out...");
        const activeCheckout = await prisma.checkout.findFirst({
            where: { bookId, status: 'CHECKED_OUT' }, // Search for active checkouts of the book
        });

        if (activeCheckout) {
            console.log("Book is already checked out:", activeCheckout);

            // Respond with an error if the book is already checked out
            return res.status(400).json({ error: "Book is already checked out" });
        }

        // Step 2: Proceed to create a new checkout record
        console.log("Proceeding to checkout the book...");
        const checkout = await prisma.checkout.create({
            data: {
                userId, // ID of the user checking out the book
                bookId, // ID of the book being checked out
                expectedCheckinDate: new Date(expectedCheckinDate), // Expected return date
            },
        });

        console.log("Book checked out successfully:", checkout);

        // Respond with success and the new checkout record
        res.status(201).json({ message: "Book checked out successfully", checkout });
    } catch (error) {
        console.error("Error checking out book:", error.message);

        // Handle unexpected errors with a generic message
        res.status(500).json({ error: "Failed to check out book" });
    }
};

// Function to handle book check-in
const checkInBook = async (req, res) => {
    try {
        // Extract the checkout ID from the request parameters
        const { id } = req.params;

        console.log("Check-in request received for checkout ID:", id);

        // Step 1: Update the checkout record to mark the book as returned
        const checkout = await prisma.checkout.update({
            where: { id: parseInt(id, 10) }, // Ensure ID is an integer
            data: {
                checkinDate: new Date(), // Record the current date as the check-in date
                status: 'RETURNED', // Update the status to 'RETURNED'
            },
        });

        console.log("Book checked in successfully:", checkout);

        // Respond with success and the updated checkout record
        res.status(200).json({ message: "Book checked in successfully", checkout });
    } catch (error) {
        console.error("Error checking in book:", error.message);

        // Handle unexpected errors with a generic message
        res.status(500).json({ error: "Failed to check in book" });
    }
};

// Export the functions for use in routes
module.exports = { checkOutBook, checkInBook };
