const prisma = require("../models/prisma.js");

const checkOutBook = async (req, res) => {
    try {
        const { bookId, expectedCheckinDate } = req.body;
        const userId = req.user.id; // Assuming user is authenticated

        console.log("Checkout request received:", { userId, bookId, expectedCheckinDate });

        // Ensure the book isn't already checked out
        console.log("Checking if the book is already checked out...");
        const activeCheckout = await prisma.checkout.findFirst({
            where: { bookId, status: 'CHECKED_OUT' },
        });

        if (activeCheckout) {
            console.log("Book is already checked out:", activeCheckout);
            return res.status(400).json({ error: "Book is already checked out" });
        }

        console.log("Proceeding to checkout the book...");
        // Check out the book
        const checkout = await prisma.checkout.create({
            data: {
                userId,
                bookId,
                expectedCheckinDate: new Date(expectedCheckinDate),
            },
        });

        console.log("Book checked out successfully:", checkout);
        res.status(201).json({ message: "Book checked out successfully", checkout });
    } catch (error) {
        console.error("Error checking out book:", error.message);
        res.status(500).json({ error: "Failed to check out book" });
    }
};

const checkInBook = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Check-in request received for checkout ID:", id);

        const checkout = await prisma.checkout.update({
            where: { id: parseInt(id, 10) },
            data: { checkinDate: new Date(), status: 'RETURNED' },
        });

        console.log("Book checked in successfully:", checkout);
        res.status(200).json({ message: "Book checked in successfully", checkout });
    } catch (error) {
        console.error("Error checking in book:", error.message);
        res.status(500).json({ error: "Failed to check in book" });
    }
};

module.exports = { checkOutBook, checkInBook };
