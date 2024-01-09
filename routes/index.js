var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/", async function (req, res, next) {
  const ratesByGiross = await getRatesByGiross(
    req.body.rate.origin,
    req.body.rate.destination
  );

  let dataAtual = new Date();
  let doisDiasNoFuturo = new Date(dataAtual);
  doisDiasNoFuturo.setDate(dataAtual.getDate() + 2);

  
  if(ratesByGiross.sucesso){
    const rates = ratesByGiross.servicos.map((rate) => {
      return {
        service_name: "Giross-test",
        description: "Includes tracking",
        service_code: "giross.standard-shipping",
        currency: "BRL",
        total_price: rate.valor * 100,
        phone_required: true,
      };
    });

    res.json({
      rates: rates,
    });

  }


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
  try {
    const payload = {
      origem: {
        address_string: `${origin.address1} ${origin.address2} ${origin.city}`,
      },
      destino: {
        address_string: `${destination.address1} ${destination.address2} ${destination.city}`,
      },
    };

    console.log(payload);
    const response = await fetch(
      "https://teste.giross.com.br/api/empresa/estimated-value",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ikdpcm9zc0B0ZXN0ZS5jb20iLCJpZCI6MTc3MzYsImlhdCI6MTcwNDgzNTQzOSwiZXhwIjoxNzA0ODcxNDM5fQ.2D6R1lz0TFv7hRGz0JxVo3URjrZztNkP7fx5MBj_aJE`,
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
