import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Event from "../models/Event.js";

export const createEvent = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError(errors.array()[0].msg, 422);

  const bannerPath = req.file ? `/uploads/${req.file.filename}` : undefined;
  const event = await Event.create({
    ...req.body,
    eventBanner: bannerPath,
    createdBy: req.user.id,
  });
  res.status(201).json({ success: true, event });
});

export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name email");
  res.json({ success: true, count: events.length, events });
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate(
    "createdBy",
    "name email"
  );
  if (!event) throw new AppError("Event not found", 404);
  res.json({ success: true, event });
});

export const updateEvent = asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);
  if (!event) throw new AppError("Event not found", 404);
  if (event.createdBy.toString() !== req.user.id)
    throw new AppError("Not authorized", 403);

  const bannerPath = req.file ? `/uploads/${req.file.filename}` : undefined;
  const payload = { ...req.body };
  if (bannerPath) payload.eventBanner = bannerPath;

  event = await Event.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, event });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new AppError("Event not found", 404);
  if (event.createdBy.toString() !== req.user.id)
    throw new AppError("Not authorized", 403);

  await event.deleteOne();
  res.json({ success: true, message: "Event deleted" });
});
