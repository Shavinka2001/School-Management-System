import jwt from "jsonwebtoken";  // Ensure you have a package like `jsonwebtoken` installed

console.log("TOKEN_KEY:", process.env.TOKEN_KEY); // Debug log

if (process.env.TOKEN_KEY) {
  throw new Error("TOKEN_KEY is not defined in the environment variables.");
}

export const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60, // 3 days
  });
};