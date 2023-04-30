module.exports = function (databaseConnection, http, loggingHandler) {
  http.post("/services/textdb/post", async (req, res) => {
    let {expireAt, issueAt, locationData, raw, vtecString} = req.body;
    await databaseConnection.query(
      `INSERT INTO "products" ("issueAt", "expireAt", "vtecString", "locationData", "raw")  
             VALUES ($1, $2, $3, $4, $5)`,
      [
        issueAt,
        expireAt,
        vtecString,
        locationData,
        raw,
      ],
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
            `Storing text product with VTEC String (${
              vtecString ?? "NO VTEC"
            })`
          );
          return res.json({
            code: 200,
            message: "Product stored in TextDB successfully.",
            product: queryResponse.rows[0],
          });
        }
      }
    );
  });
};
