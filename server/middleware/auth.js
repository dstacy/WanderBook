import jwt from "jsonwebtoken";

const secret = 'test';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const isCustomAuth = token?.length < 500;

    let decodedData;

    if (token) {
      if (isCustomAuth) {
        decodedData = jwt.verify(token, secret);
        req.userId = decodedData?.id;
      } else {
        decodedData = jwt.decode(token);
        req.userId = decodedData?.sub;
      }
    }

    next();
  } catch (error) {
    console.log(error);
    // Don't send an error response for unauthenticated users
    next();
  }
};

export default auth;
