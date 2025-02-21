

const Stripe = require('stripe');
const Payment = require('../models/payment');
const stripeConfig = require('../config/stripeConfig');

const stripe = Stripe(stripeConfig.secretKey);

// Initiate Payment
const initiatePayment = async (req, res) => {
  try {
    const { courseId, userId, amount } = req.body;

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', // or use any other currency
            product_data: {
              name: `Course ${courseId}`,
            },
            unit_amount: amount * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    });

    // Save the session info in the database
    const payment = new Payment({
      userId,
      courseId,
      stripeSessionId: session.id,
      amount,
    });

    await payment.save();

    res.status(200).json({
      success: true,
      sessionId: session.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment.',
    });
  }
};

// Handle Payment Callback (Webhook)
const handlePaymentCallback = async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const payment = await Payment.findOne({ stripeSessionId: session.id });

        if (payment) {
          payment.paymentStatus = 'success';
          await payment.save();
        }
        break;
      case 'checkout.session.async_payment_failed':
        const failedSession = event.data.object;
        const failedPayment = await Payment.findOne({ stripeSessionId: failedSession.id });

        if (failedPayment) {
          failedPayment.paymentStatus = 'failed';
          await failedPayment.save();
        }
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send('Event processed');
  } catch (err) {
    console.error(`Error processing webhook: ${err.message}`);
    res.status(400).send('Webhook error');
  }
};

// Check Payment Status
const checkPaymentStatus = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const payment = await Payment.findOne({ stripeSessionId: sessionId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.',
      });
    }

    res.status(200).json({
      success: true,
      paymentStatus: payment.paymentStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment status.',
    });
  }
};

module.exports = {
  initiatePayment,
  handlePaymentCallback,
  checkPaymentStatus,
};
