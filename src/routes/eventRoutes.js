import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  createEventRules,
  updateEventRules,
} from "../validators/eventValidators.js";
import { protect } from "../middleware/auth.js";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = Router();

// Multer setup for banner uploads (local disk)
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(process.cwd(), "src", "uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `banner_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Protect all routes below
router.use(protect);

router.post("/", upload.single("eventBanner"), createEventRules, createEvent);
router.get("/", getEvents);
router.get("/:id", getEvent);
router.patch(
  "/:id",
  upload.single("eventBanner"),
  updateEventRules,
  updateEvent
);
router.delete("/:id", deleteEvent);

export default router;
