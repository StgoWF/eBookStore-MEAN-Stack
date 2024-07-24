document.addEventListener('DOMContentLoaded', function () {
    paypal.Buttons({
        style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal',
            tagline: false,
            height: 40,
        },
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '0.01' // Reemplaza con el total de tu carrito
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                alert('Transaction completed by ' + details.payer.name.given_name);
                // Lógica adicional después de la transacción exitosa
            });
        }
    }).render('#paypal-button-container');
});
