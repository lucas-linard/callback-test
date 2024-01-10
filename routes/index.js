var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/", async function (req, res, next) {
  const ratesByGiross = await getRatesByGiross(
    req.body.rate.origin,
    req.body.rate.destination
  );

  console.log(ratesByGiross)


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

    res.json({
      rates: rates,
    });
  } else {
    res.status(400).json({
      errors: [
        {
          code: "not_found",
          message: "No rates found for the specified parameters",
        },
      ],
    });
  }
});

async function getRatesByGiross(origin, destination) {
  
  const payload = {
    origem: {
      address_string: `${origin.address1} ${origin.address2} ${origin.city}`,
    },
    destino: {
      address_string: `${destination.address1} ${destination.address2} ${destination.city}`,
    },
  };
  
  try {

    console.log(payload);
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

module.exports = router;
