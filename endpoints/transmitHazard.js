module.exports = function (databaseConnection, http, loggingHandler) {
  http.post("/services/hazard/post", async (req, res) => {
    let {
      utc_issue,
      utc_update,
      utc_expire,
      wfo,
      phenomena,
      significance,
      ugc,
      event_color,
      event_name,
      headline,
    } = req.body;
    await databaseConnection.query(
      `INSERT INTO "products" ("utc_issue", "utc_update", "utc_expire", "wfo", "phenomena", "significance", "ugc",
                                "event_color", "event_name", "headline")  
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        utc_issue,
        utc_update,
        utc_expire,
        wfo,
        phenomena,
        significance,
        ugc,
        event_color,
        event_name,
        headline,
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
            `Storing text product [$headline $phenomena.$significance] issued by [$wfo]...`
          );
          return res.json({
            code: 200,
            message: "Product stored in TextDB successfully.",
          });
        }
      }
    );
  });
};
