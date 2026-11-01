/*
  Author: Thai Ken Yong
  October 2026

  Business Services CRUD - Express API Routes
*/

import express from "express";
import { getAllServices, createService, updateService, deleteService } from "../database/businessServicesModel.js";

const router = express.Router();

// READ: Retrieve all services
router.get("/business/services", async (req, res) => {
  try {
    const services = await getAllServices();
    res.json(services);
  } catch (error) {
    console.error("Error retrieving services:", error);
    res.status(500).json({ error: "Failed to retrieve services" });
  }
});

// CREATE: Add a new service
router.post("/business/services", async (req, res) => {
  try {
    const { name, description, price, durationMinutes, isActive } = req.body;
    // Validate input data
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(durationMinutes) ||
      durationMinutes <= 0 ||
      typeof isActive !== "boolean"
    ) {
      return res.status(400).json({ error: "Invalid service data" });
    }

    // Create a new service object
    const service = {
      name: name.trim(),
      description: description.trim(),
      price,
      durationMinutes,
      isActive,
    };

    // Insert the new service into the database
    const createdService = await createService(service);

    return res.status(201).json(createdService);
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({ error: "Failed to create service" });
  }
});

 // UPDATE: Modify an existing service
router.put("/business/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, durationMinutes, isActive } = req.body;
    // Validate input data
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }
    // Validate input data
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(durationMinutes) ||
      durationMinutes <= 0 ||
      typeof isActive !== "boolean"
    ) {
      return res.status(400).json({ error: "Invalid service data" });
    }
    // Create a new service object
    const service = {
      name: name.trim(),
      description: description.trim(),
      price,
      durationMinutes,
      isActive,
    };
    // Update the service in the database
    const updated = await updateService(id, service);
    // Check if the service was found and updated
    if (!updated) {
      return res.status(404).json({ error: "Service not found" });
    }
    // Return a success response
    return res.json({ message: "Service updated successfully" });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({ error: "Failed to update service" });
  }
});

 // DELETE: Remove an existing service
router.delete("/business/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Validate the service ID
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }
    // Delete the service from the database
    const deleted = await deleteService(id);
    // Check if the service was found and deleted
    if (!deleted) {
      return res.status(404).json({ error: "Service not found" });
    }
    // Return a success response
    return res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({ error: "Failed to delete service" });
  }
});

export default router;
