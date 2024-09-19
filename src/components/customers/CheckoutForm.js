// CheckoutForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// const fetchCreatePaymenttUrl = 'http://localhost:5000/create-payment-intent';
// const fetchCreatePaymenttUrl = "";
const fetchCreatePaymenttUrl = "https://pzbybfzhitdinnvvghlz.supabase.co/functions/v1/create-payment-intent";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Ensure stripe and elements are loaded
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      // Fetch the client secret from the backend
      const response = await fetch(fetchCreatePaymenttUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000, currency: 'usd' }), // Adjust amount and currency as needed
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('Invalid client secret returned from backend');
      }

      // Confirm the payment with the client secret and card element
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        setConfirmationMessage('Thank you! Your payment was successful.');
      }
    } catch (error) {
      setError('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success ? (
        // Success message after payment
        <div style={{ color: 'green', marginTop: '20px' }}>{confirmationMessage}</div>
      ) : (
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
        <CardElement />
        <button type="submit" disabled={!stripe || loading} style={{ marginTop: '20px' }}>
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </form>
      )}
      {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}
      {/* {success && <div style={{ color: 'green', marginTop: '20px' }}>Payment Successful!</div>} */}
    </div>
  );
};

export default CheckoutForm;
