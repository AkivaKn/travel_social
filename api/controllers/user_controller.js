const { selectUsers, insertUser } = require("../models/user_model");

exports.getUsers = async (req, res, next) => {
  const users = await selectUsers();
  res.status(200).send({ users });
};

exports.postUser = async (req, res, next) => {
  try {
    const newUser = req.body;
    const postedUser = await insertUser(newUser);
    res.status(201).send({ user: postedUser });
  } catch (error) {
    next(error);
  }
};
