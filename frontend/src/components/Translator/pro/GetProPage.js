import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const GetProPage = () => {
  const [cardNumber, setCardNumber] = useState('1234567899874563');
  const [expiryDate, setExpiryDate] = useState('05/06');
  const [cvc, setCvc] = useState('223');
  const [billingPeriod, setBillingPeriod] = useState('1month');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const userId = Cookies.get('userId');

  // Validate form
  const validateForm = () => {
    let errors = {};
    if (!/^\d{16}$/.test(cardNumber))
      errors.cardNumber = 'Card number must be 16 digits.';
    if (!/^\d{2}\/\d{2}$/.test(expiryDate))
      errors.expiryDate = 'Expiry date must be in MM/YY format.';
    if (!/^\d{3}$/.test(cvc)) errors.cvc = 'CVC must be 3 digits.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(
          `http://localhost:5050/user/updatePaymentStatus/${userId}`,
          { userId, isPaid: 'yes' }
        );

        if (response.status === 200) {
          alert(`Payment successful for ${billingPeriod}!`);
          navigate('/login');
        } else {
          alert('Payment failed.');
        }
      } catch (error) {
        console.error('Error during payment:', error);
        alert('There was an error processing the payment.');
      }
    }
  };

  const getAmount = () => {
    switch (billingPeriod) {
      case '1month':
        return '$10';
      case '3months':
        return '$27';
      case '1year':
        return '$100';
      default:
        return '$10';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gradient-to-br p-4">
      {/* Left Column - Card Details */}
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg lg:mr-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Upgrade to Pro
        </h1>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="1234 5678 9012 3456"
              required
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm">{errors.cardNumber}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700"
            >
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="MM/YY"
              required
            />
            {errors.expiryDate && (
              <p className="text-red-500 text-sm">{errors.expiryDate}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="cvc"
              className="block text-sm font-medium text-gray-700"
            >
              CVC
            </label>
            <input
              id="cvc"
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.cvc ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="CVC"
              required
            />
            {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc}</p>}
          </div>

          {/* Billing Period */}
          <div>
            <label
              htmlFor="billingPeriod"
              className="block text-sm font-medium text-gray-700"
            >
              Billing Period
            </label>
            <select
              id="billingPeriod"
              value={billingPeriod}
              onChange={(e) => setBillingPeriod(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="1month">1 Month - $10</option>
              <option value="3months">3 Months - $27</option>
              <option value="1year">1 Year - $100</option>
            </select>
          </div>

          {/* Amount */}
          <div className="text-lg font-bold text-gray-900">
            Total Amount: {getAmount()}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            Pay Now
          </button>
          <Link to="/">
            <button
              className="w-full py-3 mt-4 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all text-center"
              type="button"
            >
              Cancel
            </button>
          </Link>
        </form>
      </div>

      {/* Right Column - Pro Version Details */}
      <div className="bg-indigo-100 rounded-xl shadow-xl p-8 w-full max-w-lg mt-8 lg:mt-0 lg:ml-8">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
          Why Go Pro?
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">Free Version:</div>
            <div className="text-gray-600">Basic Translation Accuracy</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-900 font-semibold">Pro Version:</div>
            <div className="text-green-600 font-bold">
              More Accurate Translations
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-900 font-semibold">Pro Features:</div>
            <ul className="text-gray-600 list-disc pl-6">
              <li>Unlimited Translations</li>
              <li>High Accuracy Levels</li>
              <li>Access to New Features</li>
              <li>Priority Support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetProPage;
