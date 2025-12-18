const mongoose = require("mongoose");
const Event = require("../models/event.model");
const RSVP = require("../models/rsvp.model");

exports.joinEvent = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // atomically increment only if attendeesCount < capacity
    const updated = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        $expr: { $lt: ["$attendeesCount", "$capacity"] },
      },
      { $inc: { attendeesCount: 1 } },
      { new: true, session }
    );

    if (!updated) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Event is full" });
    }

    // create RSVP (unique index prevents duplicates)
    try {
      await RSVP.create([{ user: req.user._id, event: updated._id }], {
        session,
      });
    } catch (err) {
   
      await session.abortTransaction();
      if (err.code === 11000)
        return res.status(400).json({ message: "Already RSVP'd" });
      return res.status(400).json({ message: err.message });
    }

    await session.commitTransaction();
    res.json({ message: "RSVP successful", event: updated });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ message: e.message });
  } finally {
    session.endSession();
  }
};

exports.leaveEvent = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const removed = await RSVP.findOneAndDelete(
      { user: req.user._id, event: req.params.id },
      { session }
    );
    if (!removed) {
      await session.abortTransaction();
      return res.status(400).json({ message: "No RSVP found" });
    }

    await Event.updateOne(
      { _id: req.params.id },
      { $inc: { attendeesCount: -1 } },
      { session }
    );

    await session.commitTransaction();
    res.json({ message: "Left event" });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ message: e.message });
  } finally {
    session.endSession();
  }
};

exports.getMyJoinedEvents = async (req, res) => {
  const rsvps = await RSVP.find({ user: req.user._id }).populate({
    path: "event",
    populate: { path: "createdBy", select: "_id email" },
  });

  const events = rsvps.map((r) => r.event);
  res.json(events);
};
