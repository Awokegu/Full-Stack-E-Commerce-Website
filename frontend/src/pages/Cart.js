import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from 'react-icons/md';
import {loadStripe} from '@stripe/stripe-js';

const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const context = useContext(Context);
    const loadingCart = new Array(4).fill(null);

    // Fetch cart data from API
    const fetchData = async () => {
        try {
            const response = await fetch(SummaryApi.addToCartProductView.url, {
                method: SummaryApi.addToCartProductView.method,
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
            });

            const responseData = await response.json();

            if (responseData.success) {
                setData(responseData.data);
                // Update notification count
                const totalQty = responseData.data.reduce(
                    (sum, product) => sum + product.quantity,
                    0
                );
                context.updateNotification(totalQty); // Update badge in the context
            } else {
                setData([]);
                context.updateNotification(0); // Clear notification if cart is empty
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    };

    // Handle loading and fetch data
    const handleLoading = async () => {
        await fetchData();
    };

    // Run on component mount
    useEffect(() => {
        setLoading(true);
        handleLoading();
        setLoading(false);
    },[]);

    // Increase item quantity
    const increaseQty = async (id, qty) => {
        try {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: qty + 1,
                }),
            });

            const responseData = await response.json();

            if (responseData.success) {
                fetchData(); // Refresh cart data
            }
        } catch (error) {
            console.error('Error increasing quantity:', error);
        }
    };

    // Decrease item quantity
    const decreaseQty = async (id, qty) => {
        if (qty >= 2) {
            try {
                const response = await fetch(SummaryApi.updateCartProduct.url, {
                    method: SummaryApi.updateCartProduct.method,
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        _id: id,
                        quantity: qty - 1,
                    }),
                });

                const responseData = await response.json();

                if (responseData.success) {
                    fetchData(); // Refresh cart data
                }
            } catch (error) {
                console.error('Error decreasing quantity:', error);
            }
        }
    };

    // Delete product from cart
    const deleteCartProduct = async (id) => {
        try {
            const response = await fetch(SummaryApi.deleteCartProduct.url, {
                method: SummaryApi.deleteCartProduct.method,
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    _id: id,
                }),
            });

            const responseData = await response.json();

            if (responseData.success) {
                fetchData(); // Refresh cart data
                context.fetchUserAddToCart(); // Update user cart state
            }
        } catch (error) {
            console.error('Error deleting cart product:', error);
        }
    };
    const handlePayment = async () => {
        console.log('Stripe API Key:', process.env.REACT_APP_STRIPE_PUBLIC_KEY);
        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    
        const response = await fetch(SummaryApi.payment.url, {
            method: SummaryApi.payment.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                CartItem: data, // Corrected syntax for passing the CartItem
            }),
        });
        
        const responseData = await response.json()
         if(responseData?.id){
            stripePromise.redirectToCheckout({sessionId : responseData .id })
         }



          console.log('payment response',responseData)

      };
    // Calculate total quantity and price
    const totalQty = data.reduce((sum, product) => sum + product.quantity, 0);
    const totalPrice = data.reduce((sum, product) => {
        const price = product?.productId?.sellingPrice || 0; // Default to 0 if price is missing
        return sum + product.quantity * price;
    }, 0);

    return (
        <div className="container mx-auto">
            <div className="text-center text-lg my-3">
                {data.length === 0 && !loading && <p className="bg-white py-5">No Data</p>}
            </div>

            <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
                {/* Product List */}
                <div className="w-full max-w-3xl">
                    {loading ? (
                        loadingCart.map((_, index) => (
                            <div
                                key={index}
                                className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                            ></div>
                        ))
                    ) : (
                        data.map((product) => {
                            if (!product || !product.productId) return null; // Skip invalid products

                            return (
                                <div
                                    key={product._id}
                                    className="w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]"
                                >
                                    <div className="w-32 h-32 bg-slate-200">
                                        <img
                                            src={product.productId.productImage?.[0] || ''}
                                            className="w-full h-full object-scale-down mix-blend-multiply"
                                            alt="Product"
                                        />
                                    </div>
                                    <div className="px-4 py-2 relative">
                                        {/* Delete product */}
                                        <div
                                            className="absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
                                            onClick={() => deleteCartProduct(product._id)}
                                        >
                                            <MdDelete />
                                        </div>

                                        <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                                            {product.productId.productName || 'Unknown Product'}
                                        </h2>
                                        <p className="capitalize text-slate-500">
                                            {product.productId.category || 'Unknown Category'}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-red-600 font-medium text-lg">
                                                {displayINRCurrency(product.productId.sellingPrice || 0)}
                                            </p>
                                            <p className="text-slate-600 font-semibold text-lg">
                                                {displayINRCurrency(
                                                    (product.productId.sellingPrice || 0) * product.quantity
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <button
                                                className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                                                onClick={() => decreaseQty(product._id, product.quantity)}
                                            >
                                                -
                                            </button>
                                            <span>{product.quantity}</span>
                                            <button
                                                className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                                                onClick={() => increaseQty(product._id, product.quantity)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Summary Section */}
                 {
               data[0] && (
                    <div className="mt-5 lg:mt-0 w-full max-w-sm">
                    {loading ? (
                        <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse"></div>
                    ) : (
                        <div className="h-36 bg-white">
                            <h2 className="text-white bg-red-600 px-4 py-1">Summary</h2>
                            <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                                <p>Quantity</p>
                                <p>{totalQty}</p>
                            </div>

                            <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                                <p>Total Price</p>
                                <p>{displayINRCurrency(totalPrice)}</p>
                            </div>

                            <button className="bg-blue-600 p-2 text-white w-full mt-2" onClick ={handlePayment}>Payment</button>
                        </div>
                    )}
                </div> 
                 )
                 } 
            </div>
        </div>
    );
};

export default Cart;
