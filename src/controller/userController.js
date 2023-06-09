/** @format */

const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const cricketModel = require("../model/cricketModel");
const hockyModel = require("../model/hockyModel");
const snakeLadderModel = require("../model/snakeLadderModel");
const ticTacToeModel = require("../model/ticTacToeModel");

const createUsers = async function (req, res) {
  try {
    let bodyData = req.body;

    let { UserId, userName, email, phone, balance, status } = bodyData;

    if (Object.keys(bodyData).length == 0) {
      return res.status(400).send({
        status: false,
        message:
          "Body should  be not Empty please enter some data to create user",
      });
    }

    let checkUserId = await userModel.findOne({ UserId: UserId });
    if (checkUserId) {
      return res.status(400).send({
        status: false,
        message: "UserId is already exist ",
      });
    }

    // let checkEmail = await userModel.findOne({ email: email });

    //   if (checkEmail) {
    //     return res.status(400).send({
    //       status: false,
    //       message: "this email is already registerd",
    //     });
    //   }

    const userCreated = await userModel.create(bodyData);
    const CricTable = await cricketModel.create(bodyData);
    const HocTable = await hockyModel.create(bodyData);
    const SnakeTable = await snakeLadderModel.create(bodyData);
    const TicTable = await ticTacToeModel.create(bodyData);

    return res.status(201).send({
      status: true,
      message: "success",
      data: userCreated,
      CricTable,
      HocTable,
      SnakeTable,
      TicTable,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// _______find by query params

const getUser = async function (req, res) {
  try {
    let UserId = req.query.UserId;

    const getNewUser = await userModel.findOne({ UserId: UserId });
    let cricket = await cricketModel.findOne({ UserId: UserId });
    let hocky = await hockyModel.findOne({ UserId: UserId });
    let snakeLadder = await snakeLadderModel.findOne({ UserId: UserId });
    let ticTacToe = await ticTacToeModel.findOne({ UserId: UserId });

    if (getNewUser.length == 0) {
      return res.status(404).send({
        status: false,
        message: "user not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Success",
      data: getNewUser,
      cricket,
      hocky,
      snakeLadder,
      ticTacToe,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};

// ___update user

const updateUser = async function (req, res) {
  try {
    let UserId = req.query.UserId;
    let updateData = req.query;

    let { userName, email, phone, balance, status } = updateData;

    if (Object.keys(updateData).length == 0) {
      return res.status(400).send({
        status: false,
        message: "For updating please enter atleast one key",
      });
    }

    let data = {};
    data.userName = userName;
    data.email = email;
    data.phone = phone;
    data.balance = balance;
    data.status = status;

    const userUpdate = await userModel.findOneAndUpdate(
      { UserId: UserId },
      { $set: data },
      { new: true }
    );

    if (userUpdate.length == 0) {
      return res.status(404).send({
        status: false,
        message: "user not found",
      });
    }

    if (userUpdate.length == UserId) {
      return res.status(404).send({
        status: false,
        message: "you can't update UserId",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Success",
      data: userUpdate,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};

module.exports = { createUsers, getUser, updateUser };
