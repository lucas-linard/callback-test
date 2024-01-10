var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/", async function (req, res, next) {
  console.log("\n -----Shopify------- \n");
  console.log(req.body);

  if (req.body.rate.destination.address2 === null) {
    return res.status(400).json({
      sucesso: false,
      error: "Não é possível calcular o frete sem o numero do endereço",
    });
  }

  const ratesByGiross = await getRatesByGiross(
    req.body.rate.origin,
    req.body.rate.destination
  );

  console.log("\n -----Giross------- \n");
  console.log(ratesByGiross);

  if (ratesByGiross.sucesso) {
    const rates = ratesByGiross.servicos.map((rate) => {
      return {
        service_name: "Giross-test",
        description: rate.service_type.name,
        service_code: "giross.standard-shipping",
        currency: "BRL",
        total_price: rate.valor * 100,
        phone_required: true,
      };
    });

    return res.json({
      rates: rates,
    });
  } else {
    return res.status(400).json(ratesByGiross.error);
  }
});

async function getRatesByGiross(origin, destination) {
  if (
    `${origin.city} - ${origin.province}` !==
    `${destination.city} - ${destination.province}`
  ) {
    return {
      sucesso: false,
      error: "Não é possível calcular o frete para cidades diferentes",
    };
  }

  const payload = {
    origem: {
      address_string: `${origin.address1}, ${
        origin.address2 ? origin.address2 : ""
      }, ${origin.city} - ${origin.province}`,
    },
    destino: {
      address_string: `${destination.address1}, ${
        destination.address2 ? destination.address2 : ""
      }, ${destination.city} - ${destination.province}`,
    },
  };

  console.log("\n -----Payload------- \n");
  console.log(payload);

  try {
    const response = await fetch(
      "https://teste.giross.com.br/api/empresa/estimated-value",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ikdpcm9zc0B0ZXN0ZS5jb20iLCJpZCI6MTc3MzYsImlhdCI6MTcwNDg4ODMyMSwiZXhwIjoxNzA0OTI0MzIxfQ.N8d7oiO3LZ7OA3b88Az0Xb2I20jbTy5dO_ijrV71VhI`,
        },
      }
    );
    const body = await response.json();
    return body;
  } catch (error) {
    throw error;
  }
}

router.post("/fulfillment_order_notification", async function (req, res, next) {

  console.log("------fullfillment_order_notification------")
  console.log(req.body)
});

module.exports = router;
