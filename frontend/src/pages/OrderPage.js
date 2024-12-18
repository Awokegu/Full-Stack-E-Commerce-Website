import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import moment from 'moment';
import displayETBCurrency from '../helpers/displayCurrency';

const OrderPage = () => {
  const [data, setData] = useState([]); // State to hold the orders

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(SummaryApi.getorder.url, {
        method: SummaryApi.getorder.method,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData.data || []); // Set data or fallback to an empty array
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Order Details</h1>

      {/* Conditional rendering for no orders */}
      {data.length === 0 ? (
        <p className="text-center text-gray-500">No Orders Available</p>
      ) : (
        data.map((item, index) => (
          <div
            key={item.id || index}
            className="order-item border rounded-lg shadow-md mb-6 p-6 bg-white"
          >
            {/* Order Date */}
            <p className="text-gray-600 text-sm mb-3">
              Order Date:{" "}
              <span className="font-semibold">
                {moment(item.createdAt).format("LL")}
              </span>
            </p>

            {/* Product Details */}
            <div className="product-details space-y-4">
              {item.productDetails.map((product, idx) => (
                <div
                  key={product.productId + idx}
                  className="flex items-center gap-4 bg-gray-100 rounded-lg p-4"
                >
                  <img
                    src={product.image[0]}
                    className="w-24 h-24 object-cover bg-white rounded-md shadow"
                    alt={product.name}
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-medium text-gray-800">
                      {product.name}
                    </h2>
                    <p className="text-gray-600">
                      Price: {displayETBCurrency(product.price)}
                    </p>
                    <p className="text-gray-600">Quantity: {product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Details */}
            <div className="payment-details mt-6">
              <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
              <div className="bg-blue-50 p-4 rounded-lg text-blue-700">
                <p>
                  <span className="font-semibold">Payment Method:</span>{" "}
                  {item.paymentDetails.payment_method_type[0]}
                </p>
                <p>
                  <span className="font-semibold">Payment Status:</span>{" "}
                  {item.paymentDetails.payment_status}
                </p>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="shipping-details mt-6">
              <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
              <div className="bg-green-50 p-4 rounded-lg text-green-700">
                {item.shipping_options.map((shipping, idx) => (
                  <p key={idx}>
                    <span className="font-semibold">Shipping Amount:</span>{" "}
                    {displayETBCurrency(shipping.shipping_amount)}
                  </p>
                ))}
              </div>
            </div>

            {/* Total Amount */}
            <div className="total-amount mt-6 text-right">
              <h3 className="text-lg font-semibold">
                Total Amount:{" "}
                <span className="text-blue-700">
                  {displayETBCurrency(item.totalAmount)}
                </span>
              </h3>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderPage;
