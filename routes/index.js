var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/", function (req, res, next) {
  console.log(JSON.stringify(req.body, null, 2));

  let dataAtual = new Date();
  let doisDiasNoFuturo = new Date(dataAtual);
  doisDiasNoFuturo.setDate(dataAtual.getDate() + 2);

  res.json({
    rates: [
      {
        service_name: "Giross-test",
        description: "Includes tracking",
        service_code: "giross.standard-shipping",
        currency: "BRL",
        total_price: 100000,
        phone_required: true,
        min_delivery_date: new Date(),
        max_delivery_date: doisDiasNoFuturo,
      }
    ]
  });
});

module.exports = router;
