"use strict";
require("dotenv").config();
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { db } = require("../db.js");

const registerUser = async function (req, res) {
  try {
    const inValidPayload = await payloadValidator(req.body);
    if (inValidPayload.errors.length) {
      return res.status(400).json(inValidPayload);
    } else {
      try {
        const collectionRef = db.collection("users");
        // Perform the search query
        const query = collectionRef.where("email", "==", `${req.body.email}`);
        const snapshot = await query.get();

        if (snapshot.empty) {
          //encrypt the password
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          req.body.password = hashedPassword;
          await db.collection("users").add(req.body);
          res.status(201).json({ message: "User registered successfully" });
          return;
        } else {
          res.status(400).json("User Already Exists!");
        }
      } catch (error) {
        console.error("Error searching documents:", error);
      }
    }
  } catch (error) {
    console.log(`Registration Unssuccessful Due to Error: ${error}`);
  }
};

async function userLogin(req, res) {
  try {
    const inValidPayload = await payloadValidator(req.body);
    const validationErrors = inValidPayload.errors.filter(
      (ele) => ele.field === "email" || ele.field === "password"
    );
    if (validationErrors.length) {
      return res.status(400).json();
    } else {
      const collectionRef = db.collection("users");
      // Perform the search query
      const query = collectionRef.where("email", "==", `${req.body.email}`);
      const snapshot = await query.get();
      if (snapshot.empty) {
        return res.status(400).json({
          statusCode: 400,
          message: "User Not Found. Please Register Yourself",
        });
      } else {
        let docData;
        let docId;
        snapshot.forEach((doc) => {
          docId = doc.id;
          docData = doc.data();
        });

        const passwordMatch = await bcrypt.compare(
          req.body.password,
          docData.password,
        );
        if (passwordMatch) {
          let jwtToken;
          try {
            jwtToken = await jwt.sign({docData }, process.env.SECRET_KEY);
          } catch (err) {
            console.error("Error while generating token: ", err);
            return res.status(500).json({
              statusCode: 500,
              message: "Internal Server Error",
            });
          }
          if (jwtToken) {
            const user = {
              email: docData.email,
              id: docId,
              jwtToken,
              issuedAt: new Date(),
            };
            return res.status(200).json({
              message: "Login Successful!",
              statusCode: 200,
              user,
            });
          }
        } else {
          return res.json({
            statusCode: 401,
            message: "Incorrect password",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error while login: ", error);
  }
}

async function payloadValidator(payload) {
  const { firstName, lastName, email, password, phone, address, isAdmin } =
    payload;
  const errorMessage = {
    errors: [],
  };

  //First Name Validator
  if (!firstName) {
    errorMessage.errors.push({
      field: "firstName",
      error: "First Name Missing",
    });
  } else if (typeof firstName !== "string") {
    errorMessage.errors.push({
      field: "firstName",
      error: "firstName should be a valid string",
    });
  }

  // Last Name Validator
  if (!lastName) {
    errorMessage.errors.push({
      field: "lastName",
      error: "Last Name Missing",
    });
  } else if (typeof lastName !== "string") {
    errorMessage.errors.push({
      field: "lastName",
      error: "Last Name should be a valid string",
    });
  }

  // Email Address Validator
  if (!email) {
    errorMessage.errors.push({
      field: "email",
      error: "Missing email address",
    });
  } else if (!validator.isEmail(email)) {
    errorMessage.errors.push({
      field: "email",
      error: "Valid Email Address Required",
    });
  }

  // Password Address Validator
  if (!password) {
    errorMessage.errors.push({
      field: "password",
      error: "Missing Password",
    });
  } else if (
    !validator.isAlphanumeric(password) ||
    password.length < 8 ||
    password.length > 30
  ) {
    errorMessage.errors.push({
      field: "password",
      error: "Inappropriate Password Length",
    });
  }

  // Address Validator
  if (typeof address !== "string") {
    errorMessage.errors.push({
      field: "address",
      error: "Inappropriate Address",
    });
  }

  // Phone Number Validator
  if (typeof phone !== "number") {
    errorMessage.errors.push({
      field: "phone",
      error: "Inappropriate Phone Number",
    });
  }

  //Administrator Validator
  if (isAdmin === 'undefined' || isAdmin === null) {
    errorMessage.errors.push({
      field: "isAdmin",
      error: "isAdmin value is required",
    });
  } else if (
    payload.hasOwnProperty("isAdmin") &&
    typeof payload.isAdmin != "boolean"
  ) {
    errorMessage.errors.push({
      field: "isAdmin",
      error: "Must be true or false",
    });
  }
  return errorMessage;
}

module.exports = { registerUser, userLogin };
