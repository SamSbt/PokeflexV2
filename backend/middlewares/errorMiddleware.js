export const errormiddleware = (err, req, res, next) => {
  // console.error(err.stack);

  if (err.name = "tokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }


  return res.status(500).json({ message: "Something went wrong" });

}