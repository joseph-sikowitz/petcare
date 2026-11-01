/*
  Author: Thai Ken Yong
  November 2026

  Business Appointments CRUD - Express API Routes
*/

import express from "express";
import {
  getAppointmentsByDate,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  searchCustomers,
  getPetsByCustomer,
} from "../database/businessAppointmentsModel.js";

const router = express.Router();

// READ: Retrieve appointments by date and optional status
router.get("/business/appointments", async (req, res) => {
  try {
    const { date, status, startTime, endTime } = req.query;

    // Validate date and status
    if (
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      (status && !["scheduled", "completed", "cancelled"].includes(status)) ||
      (startTime !== undefined &&
        (typeof startTime !== "string" ||
          !Number.isFinite(Date.parse(startTime)))) ||
      (endTime !== undefined &&
        (typeof endTime !== "string" ||
          !Number.isFinite(Date.parse(endTime)))) ||
      ((startTime === undefined) !== (endTime === undefined)) ||
      (startTime !== undefined &&
        new Date(startTime) >= new Date(endTime))
    ) {
      return res.status(400).json({ error: "Invalid date, status, or time range" });
    }

    const appointments = await getAppointmentsByDate(
      date,
      status,
      startTime,
      endTime,
    );
    return res.json(appointments);
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    return res.status(500).json({ error: "Failed to retrieve appointments" });
  }
});

// READ: Search customers by name
router.get("/business/appointments/customers", async (req, res) => {
  try {
    const { search } = req.query;

    if (typeof search !== "string" || !search.trim()) {
      return res.json([]);
    }

    const customers = await searchCustomers(search.trim());
    return res.json(customers);
  } catch (error) {
    console.error("Error searching customers:", error);
    return res.status(500).json({ error: "Failed to search customers" });
  }
});

// READ: Retrieve pets belonging to a customer
router.get(
  "/business/appointments/customers/:userId/pets",
  async (req, res) => {
    try {
      const { userId } = req.params;

      if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        return res.status(400).json({ error: "Invalid customer ID" });
      }

      const pets = await getPetsByCustomer(userId);
      return res.json(pets);
    } catch (error) {
      console.error("Error retrieving pets:", error);
      return res.status(500).json({ error: "Failed to retrieve pets" });
    }
  },
);

// CREATE: Add a new appointment
router.post("/business/appointments", async (req, res) => {
  try {
    const { user_id, pet_id, service_id, startTime, notes } = req.body;

    // Validate input data
    if (
      ![user_id, pet_id, service_id].every(
        (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id),
      ) ||
      typeof startTime !== "string" ||
      !Number.isFinite(Date.parse(startTime)) ||
      (notes !== undefined && typeof notes !== "string")
    ) {
      return res.status(400).json({ error: "Invalid appointment data" });
    }

    const appointment = {
      user_id,
      pet_id,
      service_id,
      startTime,
      notes: notes ?? "",
    };

    const createdAppointment = await createAppointment(appointment);
    return res.status(201).json(createdAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({ error: "Failed to create appointment" });
  }
});

// UPDATE: Modify an existing appointment
router.put("/business/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, pet_id, service_id, startTime, status, notes } = req.body;

    // Validate appointment ID
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: "Invalid appointment ID" });
    }

    // Validate input data
    if (
      ![user_id, pet_id, service_id].every(
        (value) => typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value),
      ) ||
      typeof startTime !== "string" ||
      !Number.isFinite(Date.parse(startTime)) ||
      !["scheduled", "completed", "cancelled"].includes(status) ||
      (notes !== undefined && typeof notes !== "string")
    ) {
      return res.status(400).json({ error: "Invalid appointment data" });
    }

    const appointment = {
      user_id,
      pet_id,
      service_id,
      startTime,
      status,
      notes: notes ?? "",
    };

    const updated = await updateAppointment(id, appointment);

    if (!updated) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    return res.json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return res.status(500).json({ error: "Failed to update appointment" });
  }
});

// DELETE: Permanently remove an appointment
router.delete("/business/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate appointment ID
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: "Invalid appointment ID" });
    }

    const deleted = await deleteAppointment(id);

    if (!deleted) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    return res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return res.status(500).json({ error: "Failed to delete appointment" });
  }
});

export default router;
