var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(req);

  let dataAtual = new Date();
  let doisDiasNoFuturo = new Date(dataAtual);
  doisDiasNoFuturo.setDate(dataAtual.getDate() + 2);

  res.json({
    service_name: "Giross-test",
    description: "Includes tracking",
    service_code: "giross.standard-shipping",
    currency: "BRL",
    total_price: 100.000,
    phone_required: true,
    min_delivery_date: new Date(),
    max_delivery_date: doisDiasNoFuturo,
  });
});

module.exports = router;
