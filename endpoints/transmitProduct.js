module.exports = function (databaseConnection, http, loggingHandler) {
  http.push("/services/textdb/push", async (req, res) => {
      let product = {
          issueAt: req.body.issueAt,
          expireAt: req.body.expireAt,
          vtecString: req.body.expireAt,
          locationData: req.body.locationData,
          raw: req.body.raw,
      }
      await databaseConnection.query(
          `INSERT INTO "products" ("issueAt", "expireAt", "vtecString", "locationData", "raw")  
             VALUES ($1, $2, $3, $4, $5)`, [product.issueAt, product.expireAt, product.vtecString,
                                            product.locationData, product.raw],
          (queryError, queryResponse) => {
              if (queryError) {
                  loggingHandler.write("error", queryError.stack);
                  return res.json({
                      code: 500,
                      message:
                          "An error occurred whilst attempting to transmit the product.",
                  });
              } else {
                  loggingHandler.write(
                      "info",
                      `Storing text product with VTEC String (${product.vtecString ?? "NO VTEC"})`
                  );
                  return res.json(queryResponse.rows[0]);
              }
          }
      );
  });
};
