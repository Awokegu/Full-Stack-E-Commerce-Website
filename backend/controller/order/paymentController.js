const stripe = require('../../config/stripe');
const userModel = require('../../models/userModel');

const paymentController = async (Request, Response) => {
    try {
        const { CartItem } = Request.body;

        // Find the user by ID from the token or request
         const user = await userModel.findOne({ _id: Request.userId });

        if (!user) {
            throw new Error("User not found");
        }

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'], // Correct parameter name
            billing_address_collection: 'auto',
            shipping_options: [
                {
                    shipping_rate: 'shr_1QScUkG3eSWxvgWO8ZBB4oii',
                },
            ],
            customer_email: user.email,
            metadata :{
                userId : Request.userId
            },
            line_items: CartItem.map((item) => ({
                price_data: {
                    currency: 'etb',
                    product_data: {
                        name: item.productId.productName,
                        images: Array.isArray(item.productId.productImage) 
                            ? [item.productId.productImage[0]] // Use the first image from the array
                            : [item.productId.productImage],  // Treat it as a string
                        metadata: {
                            productId: item.productId._id,
                        },
                    },
                    unit_amount: item.productId.sellingPrice * 100, // Stripe expects amount in cents
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1,
                },
                quantity: item.quantity,
            })),
            
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        };

        const session = await stripe.checkout.sessions.create(params);

        Response.status(303).json(session);
    } catch (error) {
        console.error("Error in paymentController:", error.message || error);
        Response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

module.exports = paymentController;
