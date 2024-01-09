var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/", async function (req, res, next) {

  const rate = await getRatesByGiross(req.body.rate.origin, req.body.rate.destination);
  console.log("rate", rate);
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
      },
    ],
  });
});

async function getRatesByGiross(origin, destination) {
  console.log("origin", `${origin.address1} ${origin.address2} ${origin.city}`);
  console.log(
    "destination",
    `${destination.address1} ${destination.address2} ${destination.city}`
  );
  fetch("https://teste.giross.com.br/api/empresa/estimated-value", {
    method: "POST",
    body: {
      origem: {
        address_string: `${origin.address1} ${origin.address2} ${origin.city}`,
      },
      destino: {
        address_string: `${destination.address1} ${destination.address2} ${destination.city}`,
      },
    },
  }).then((res) => res.json());
}

module.exports = router;
