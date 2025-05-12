import jwt from "jsonwebtoken";

// creating a variable token to authenticate the user's usage of the app
// create a server token which expires every 1 day
// create an access token which is granted every time a user logins
// server key will compare both access and server token and role assignment

export function signJwt(user, expiresIn = "1d") {
  // expiresIn is a string like "1h", "10h", "7d"
  const secretKey = process.env.JWT_SECRET_KEY;
  const idToken = jwt.sign(user, secretKey, { expiresIn });
  return idToken;
}

export function verifyJwt(idToken) {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const user = jwt.verify(idToken, secretKey);
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
