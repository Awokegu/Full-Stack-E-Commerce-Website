const stripe = require('../../config/stripe'); // Import Stripe instance
const orderModel = require('../../models/orderProductModel');
const addToCartModel =require('../../models/cartProduct')
const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

async function getlineItems(lineItems) {
    let productItems = [];
    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await stripe.products.retrieve(item.price.product);
            const productId = product.metadata.productId;
            const productData = {
                productId: productId,
                name: product.name,
                price: item.price.unit_amount / 100,
                quantity: item.quantity,
                image: product.images,
            };
            productItems.push(productData);
        }
    }
    return productItems;
}

// Webhook handler
const webhooks = async (request, response) => {
    const sig = request.headers['stripe-signature']; // Stripe signature from the request header
    const payloadString = JSON.stringify(request.body);

    const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: endpointSecret, // Corrected argument name
    });

    let event;

    try {
        // Verify the event using Stripe's constructEvent method
        event = stripe.webhooks.constructEvent(
            payloadString, // Raw body payload
            header,        // Signature from Stripe
            endpointSecret // Endpoint secret
        );
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            const productDetails = await getlineItems(lineItems);

            // Extract shipping options from the session
            const shippingOptions = session.shipping_options || [];

            const orderDetails = {
                productDetails: productDetails,
                email: session.customer_email,
                userId: session.metadata.userId,
                paymentDetails: {
                    paymentId: session.payment_intent,
                    payment_method_type: session.payment_method_types,
                    payment_status: session.payment_status,
                },
                shippingOptions: shippingOptions.map((s) => ({
                    shipping_amount: (s.shipping_amount / 100).toFixed(2), // Converts to a decimal with two places
                })),
                totalAmount: session.amount_total / 100,
            };

            const order = new orderModel(orderDetails);
            const saveOrder = await order.save()

            if(saveOrder?._id){
                const deleteCartItem =  await addToCartModel.deleteMany({userId :session.metadata.userId})
            }
            break;
           
        default:
            console.log('Unhandled event type:', event.type);
    }

    // Send a 200 response to acknowledge receipt of the event
    response.status(200).send('Event received');
};

module.exports = webhooks;
