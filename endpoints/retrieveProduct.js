module.exports = function (databaseConnection, http, loggingHandler) {
  http.get("/services/textdb/get/:identifier", (req, res) => {
    return databaseConnection.query(
      `SELECT * FROM public.products WHERE identifier = ${req.params.identifier}`,
      (queryError, queryResponse) => {
        if (queryError) {
          loggingHandler.write("error", queryError.stack);
          return res.json({
            code: 500,
            message: "An error occurred whilst attempting to retrieve the product.",
          });
        } else {
          loggingHandler.write("info", `Serving text product (${req.params.identifier}) to (${req.ip})`)
          return res.json(queryResponse.rows[0]);
        }
      }
    );
  });
};
