const express = require("express");
const {
  createOrganization,
  getMyOrganization,
  getOrganizations,
  getOrganizationById,
} = require("../controllers/organizationController");
const { protect } = require("../middleware/authMiddleware"); // Import our auth middleware

const router = express.Router();

// All organization routes require authentication
router.use(protect);

router.post("/", createOrganization);
router.get("/my", getMyOrganization); // Get the organization the user belongs to

// Future routes (might not be needed for MVP)
router.get("/", getOrganizations);
router.get("/:id", getOrganizationById);

module.exports = router;
