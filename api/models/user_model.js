const db = require("../../db/connection");

exports.selectUsers = async () => {
  const userData = await db.query(`SELECT * FROM users;`);
  return userData.rows;
};

exports.insertUser = async (newUser) => {
  const { name, email, email_verified, phone_number, image } = newUser;
  const postedUser = await db.query(
    `INSERT INTO users ( name, email, email_verified, phone_number, image) VALUES ($1,$2,$3,$4,$5) RETURNING *;`,
    [name, email, email_verified, phone_number, image]
  );    
  return postedUser.rows[0];
};
