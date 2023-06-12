"use strict";
require("dotenv").config();
const { db } = require("../db.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const getAllAppointments = async function (req, res) {
  try {
    const collectionRef = db.collection("appointments");
    const querySnapshot = await collectionRef.get();
    if (querySnapshot) {
      // const documents = Object.entries(querySnapshot).map(([key, value]) => ({
      //   documentId: key,
      //   ...value,
      // }));
      const doucuments = [];
      querySnapshot.forEach((doc) => {
        doucuments.push(doc.data());
      });
      res.status(200).json(doucuments);
    } else {
      res.status(200).json("No documents found.");
    }
  } catch (error) {
    res.status(404).json({ message: "Error fetching documents", error: error });
  }
};

const getAppointmentById = async function (req, res) {
  const documentId = req.params.id;
  try {
    const appointmentRef = db.collection("appointments").doc(documentId);
    const appointementSnapshot = await appointmentRef.get();
    if (appointementSnapshot.exists) {
      const appointmentsData = appointementSnapshot.data();
      res.status(200).json({
        message: "Appointment Details Available",
        data: appointmentsData,
      });
    } else {
      res.status(404).json({ message: "No Document Found With Respective ID" });
    }
  } catch (error) {
    res.status(404).json({
      message: "Error Occurred While Fetching Appointment",
      error: error,
    });
  }
};

const addAppointments = async function (req, res) {
  const inValidPayload = await payloadValidator(req.body);
  if (inValidPayload.errors.length) {
    return res.status(400).json(inValidPayload);
  } else {
    const userId = req.body.user_id;
    const userRef = db.collection("users").doc(userId);
    const userSnapshot = await userRef.get();
    if (userSnapshot.exists) {
      await db.collection("appointments").add(req.body);
      res.status(201).json("Appointment Created Successfully!!");
    } else {
      res.status(404).json(`Invalid User Id in the Payload!`);
    }
  }
};

const updateAppointments = async function (req, res) {
  try {
    const appointmentId = req.params.id;
    const appointmentRef = db.collection("appointments").doc(appointmentId);
    const appointmentSnapshot = await appointmentRef.get();
    if (appointmentSnapshot.exists) {
      const appointmentData = appointmentSnapshot.data();
      if (appointmentData !== null) {
        try {
          const documentRef = db.collection("appointments").doc(appointmentId);
          await documentRef.update(req.body);
          res
            .status(201)
            .json({ message: "Appointment Updated Successfully!" });
        } catch (error) {
          res.status(400).json({
            error: error,
            message: "Appointment Updation Failed!",
          });
        }
      } else {
        res.status(404).json(`Invalid Appointment Id in the Payload!`);
      }
    }
  } catch (error) {
    res.status(400).json("Error Occurred:", error);
  }
};

const deleteAppointmentById = async function (req, res) {
  const appointmentId = req.params.id;
  try {
    const appointmentRef = db.collection("appointments").doc(appointmentId);
    const appointmentSnapshot = await appointmentRef.get();
    if (appointmentSnapshot.exists) {
      const appointmentsData = appointmentSnapshot.data();
      await appointmentRef.delete();
      res.status(200).json({
        message: "Document Deleted Successfully",
        data: appointmentsData,
      });
    } else {
      res
        .status(404)
        .json({ message: "No Appointment Found With Respective ID" });
    }
  } catch (error) {
    res.status(404).json({
      message: "Error Occurred While Deleting Appointment",
      error: error,
    });
  }
};
async function payloadValidator(payload) {
  const { user_id, time, duration, location, status, notes, payment_status } =
    payload;
  const errorMessage = {
    errors: [],
  };

  //user_id Validator
  if (!user_id) {
    errorMessage.errors.push({
      field: "user_id",
      error: "Users Id Missing",
    });
  } else if (typeof user_id !== "string") {
    errorMessage.errors.push({
      field: "user_id",
      error: "Invalid user_id type",
    });
  }

  // time-validator Validator
  if (!time) {
    errorMessage.errors.push({
      field: "time",
      error: "Time is Missing",
    });
  } else if (validator.isISO8601(`1970-01-01T${time}:00Z`, { strict: true })) {
    errorMessage.errors.push({
      field: "time",
      error: "Invalid Time",
    });
  }

  //Duration Validator
  if (!duration) {
    errorMessage.errors.push({
      field: "duration",
      error: "Duration is Missing!",
    });
  } else if (typeof duration !== "string") {
    errorMessage.errors.push({
      field: "duration",
      error: "Inapproprioate Duration Type",
    });
  }

  // Password Address Validator
  if (!location) {
    errorMessage.errors.push({
      field: "location",
      error: "Location Password",
    });
  } else if (typeof location !== "string") {
    errorMessage.errors.push({
      field: "location",
      error: "Inappropriate Location Type",
    });
  }

  // Status Validator
  if (typeof status !== "string") {
    errorMessage.errors.push({
      field: "status",
      error: "Inappropriate Status Type",
    });
  }

  // Notes Validator
  if (typeof notes !== "string") {
    errorMessage.errors.push({
      field: "notes",
      error: "Inappropriate Notes Type",
    });
  }

  //Payment Status Validator
  if (!payment_status) {
    errorMessage.errors.push({
      field: "payment_status",
      error: "Payment Status value is required",
    });
  }
  return errorMessage;
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  addAppointments,
  updateAppointments,
  deleteAppointmentById,
};
