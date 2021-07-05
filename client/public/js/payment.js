var stripe = Stripe("pk_test_xxx");
var elements = stripe.elements();

var order = {
    items: [
        {
            name: "scrab",
            amount: 2000,
            quantity: 2
        },
        {
            name: "soap",
            amount: 1500,
            quantity: 1
        }
    ],
    currency: "jpy",
    paymentMethodId: null
}

var style = {
    base: {
        color: "#32325d"
    }
}

var card = elements.create("card", {style: style});

card.mount("#card-element");

card.on('change', ({error}) => {
    const displayError = document.getElementById('card-errors');
    if(error) {
        displayError.textContent = error.message;
    } else {
        displayError.textContent = '';
    }
});

const submitButton = document.getElementById("payment-form-submit");

submitButton.addEventListener('click', function(event) {
    stripe
        .createPaymentMethod("card", card)
        .then(function(result) {
            if(result.error) {

            } else {
                order.paymentMethodId = result.paymentMethod.id;

                // サーバーサイドへ決済情報を渡して結果をハンドリング
                fetch("http://localhost:3000/v1/order/payment", {Method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(order)})
                .then(function(result) {
                    return result.json();
                })
                .then(function(response) {

                });
            }
        })
        .catch(function() {

        });
});