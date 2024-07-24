// services/paypal.js
const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment(
  "AS4Or1-wqmvBkyfj8fC2cnXud-SZWE2jz8t4pEHndW341xHtN_F7jRkkmPPkOPrppph-Rwpat11aptOk",
 "EKs5VrxZeWxxOAK8EVWFR1DeovqJ3h4JbumeGmQaEeojrx0AHsje1oGBTlnD-9156x9LssaY9OInuuA8"
);

const client = new paypal.core.PayPalHttpClient(environment);

module.exports = { client };
