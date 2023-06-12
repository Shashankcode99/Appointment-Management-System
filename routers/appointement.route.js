const express = require("express");
const router = express.Router();
const { isAdmin } =  require("../middlewares/verifyToken");
const appointmentController = require("../controllers/appointment.controller");
router.get("/appointments", isAdmin, appointmentController.getAllAppointments);
router.get("/appointments/:id", isAdmin, appointmentController.getAppointmentById);
router.put("/appointments/:id", isAdmin, appointmentController.updateAppointments);
router.post("/appointments", isAdmin, appointmentController.addAppointments);
router.delete("/appointments/:id", isAdmin, appointmentController.deleteAppointmentById);

module.exports = {router};