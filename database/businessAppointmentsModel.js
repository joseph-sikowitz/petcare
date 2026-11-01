/*
  Author: Thai Ken Yong
  November 2026

  Business Appointments CRUD - MongoDB Operations
*/

import database from "./db.js";
import { ObjectId } from "mongodb";

const db = database();

/*
  READ: Retrieve appointments for a selected date and optional status
  including customer, pet and service details.
*/
export async function getAppointmentsByDate(
  date,
  status,
  startTime,
  endTime,
) {
  const collection = await db.getCollection("appointments");

  const startOfDay = startTime
    ? new Date(startTime)
    : new Date(`${date}T00:00:00.000Z`);

  const endOfDay = endTime
    ? new Date(endTime)
    : new Date(`${date}T00:00:00.000Z`);

  if (!endTime) {
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
  }

  const filter = {
    startTime: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  };

  if (status) {
    filter.status = status;
  }

  return collection
    .aggregate([
      { $match: filter },

      // Retrieve the customer information
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Retrieve the pet information
      {
        $lookup: {
          from: "pets",
          localField: "pet_id",
          foreignField: "_id",
          as: "pet",
        },
      },
      {
        $unwind: {
          path: "$pet",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Retrieve the service information
      {
        $lookup: {
          from: "services",
          localField: "service_id",
          foreignField: "_id",
          as: "service",
        },
      },
      {
        $unwind: {
          path: "$service",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Add readable fields for the React appointment table
      {
        $addFields: {
          customerName: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$customer.firstName", ""] },
                  " ",
                  { $ifNull: ["$customer.lastName", ""] },
                ],
              },
            },
          },
          petName: "$pet.name",
          serviceName: "$service.name",
          durationMinutes: "$service.durationMinutes",
        },
      },

      // Exclude joined documents; retain appointment IDs for editing
      {
        $project: {
          customer: 0,
          pet: 0,
          service: 0,
        },
      },

      { $sort: { startTime: 1 } },
    ])
    .toArray();
}

// CREATE: Create a new appointment
export async function createAppointment(appointment) {
  const collection = await db.getCollection("appointments");
  const newAppointment = {
    user_id: new ObjectId(appointment.user_id),
    pet_id: new ObjectId(appointment.pet_id),
    service_id: new ObjectId(appointment.service_id),
    startTime: new Date(appointment.startTime),
    status: "scheduled",
    notes: appointment.notes ?? "",
  };

  const result = await collection.insertOne(newAppointment);
  return { _id: result.insertedId, ...newAppointment };
}

// UPDATE: Update an existing appointment
export async function updateAppointment(id, appointment) {
  const collection = await db.getCollection("appointments");
  const updates = {};

  if (appointment.user_id !== undefined) {
    updates.user_id = new ObjectId(appointment.user_id);
  }

  if (appointment.pet_id !== undefined) {
    updates.pet_id = new ObjectId(appointment.pet_id);
  }

  if (appointment.service_id !== undefined) {
    updates.service_id = new ObjectId(appointment.service_id);
  }

  if (appointment.startTime !== undefined) {
    updates.startTime = new Date(appointment.startTime);
  }

  if (appointment.status !== undefined) {
    updates.status = appointment.status;
  }

  if (appointment.notes !== undefined) {
    updates.notes = appointment.notes;
  }

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates },
  );

  return result.matchedCount > 0;
}

// DELETE: Permanently delete an appointment
export async function deleteAppointment(id) {
  const collection = await db.getCollection("appointments");
  const result = await collection.deleteOne({
    _id: new ObjectId(id),
  });

  return result.deletedCount > 0;
}

// READ: Search customers by name
export async function searchCustomers(search) {
  const collection = await db.getCollection("users");
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return collection
    .find({
      $or: [
        { firstName: { $regex: escapedSearch, $options: "i" } },
        { lastName: { $regex: escapedSearch, $options: "i" } },
      ],
    })
    .project({ firstName: 1, lastName: 1 })
    .limit(20)
    .toArray();
}

// READ: Retrieve pets belonging to a selected customer
export async function getPetsByCustomer(userId) {
  const collection = await db.getCollection("pets");

  return collection.find({ user_id: new ObjectId(userId) }).toArray();
}
