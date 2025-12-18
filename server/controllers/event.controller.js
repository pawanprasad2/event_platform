const Event = require("../models/event.model");
const RSVP = require("../models/rsvp.model");

exports.createEvent = async (req, res) => {
  try {
    const { title, description, dateTime, location, capacity } = req.body;

    if (!title || !description || !dateTime || !location || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      title,
      description,
      dateTime,
      location,
      capacity: Number(capacity),
      imageUrl: req.file?.path || "",
      createdBy: req.user._id,
      attendeesCount: 0,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create event" });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      dateTime: { $gte: new Date() },
    })
      .populate("createdBy", "_id email firstname")
      .sort({ dateTime: 1 });

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowedFields = [
      "title",
      "description",
      "dateTime",
      "location",
      "capacity",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] =
          field === "capacity" ? Number(req.body[field]) : req.body[field];
      }
    });

    if (req.file?.path) {
      event.imageUrl = req.file.path;
    }

    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await RSVP.deleteMany({ event: event._id });
    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "_id email firstname"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};
