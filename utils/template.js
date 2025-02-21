export const getFailureEmailTemplate = (
  transactionId,
  courseName,
  amount,
  errorMessage
) => {
  return `
    <h1>Payment Failed</h1>
    <p>Dear User,</p>
    <p>Unfortunately, your payment could not be processed.</p>
    <ul>
      <li><strong>Transaction ID:</strong> ${transactionId}</li>
      <li><strong>Course Name:</strong> ${courseName}</li>
      <li><strong>Payment Failed for amount:</strong> ${amount} Rs</li>
      <li><strong>Error:</strong> ${errorMessage}</li>
      <li><strong>Status:</strong> Failed</li>
    </ul>
    <p>Please try again or contact support for assistance.</p>
  `;
};

export const getSuccessEmailTemplate = (transactionId, courseName, amount) => {
  return `
    <h1>Payment Successful</h1>
    <p>Dear User,</p>
    <p>Your payment has been successfully processed.</p>
    <ul>
      <li><strong>Transaction ID:</strong> ${transactionId}</li>
      <li><strong>Course Name:</strong> ${courseName}</li>
      <li><strong>Amount Paid:</strong> ${amount} Rs</li>
      <li><strong>Status:</strong> Successful</li>
    </ul>
    <p>Thank you for your purchase!</p>
  `;
};
