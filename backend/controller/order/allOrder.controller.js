const orderModel = require("../../models/orderProductModel");
const userModel = require("../../models/userModel");

const allOrderController = async (request, response) => {
    try {
        const userId = request.userId;

        // Verify the user and role
        const user = await userModel.findById(userId);
        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }

        if (user.role !== "ADMIN") {
            return response.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // Fetch all orders
        const allOrders = await orderModel.find().sort({ createdAt: -1 });

        return response.status(200).json({ 
            data: allOrders, 
            success: true
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return response.status(500).json({ message: 'Internal server error.', success: false });
    }
};

module.exports = allOrderController;
