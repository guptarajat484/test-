const bcrypt = require("bcrypt");
const Joi = require("joi");
const db = require("../models");
const jwt = require("jsonwebtoken");
const User = db.User;

async function signup(req, res) {
  const reg = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmpassword: Joi.ref("password"),
  });

  const { error } = reg.validate(req.body);
  if (error) {
    return res.status(422).send({ Error: error.details[0].message });
  }

  const { name, email, password, confirmpassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(422).send({ Message: "User is already register" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await User.create({ name, email, password: hash });

    return res.status(201).send({ Message: "User register sucessfully!" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ Error: e });
  }
}

async function login(req, res) {
  const login = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  const { error } = login.validate(req.body);

  const { email, password } = req.body;

  if (error) {
    return res.status(422).send({ Error: error.details[0].message });
  }
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(422).send({ Error: "User not found" });
    }

    const compare = bcrypt.compareSync(password, user.password);

    if (!compare) {
      return res
        .status(422)
        .send({ Message: "Please enter valid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );
    return res.status(200).send({ Access_token: token });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ Error: e });
  }
}

async function update_profile(req, res) {
  const { name, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    await User.update(
      { name, email, password: hash },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    return res.status(200).send({ Message: "User update succesfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ Error: e });
  }
}

async function delete_profile(req, res) {
  try {
    await User.destroy({
      where: {
        id: req.user.id,
      },
    });
    return res.status(200).send({ Message: "User deleted succesfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ Error: e });
  }
}

module.exports = {
  signup,
  login,
  update_profile,
  delete_profile,
};
