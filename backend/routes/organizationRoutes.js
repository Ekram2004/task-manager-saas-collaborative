const express = require("express");
const {
  createOrganization,
  getMyOrganization,
  getOrganizations,
  getOrganizationById,
  addOrganizationMember, // New
  removeOrganizationMember, // New
} = require("../controllers/organizationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // All organization routes require authentication

router.post("/", createOrganization);
router.get("/my", getMyOrganization);

// New routes for member management
router.post("/:id/members", addOrganizationMember); // Add member by email to a specific organization
router.delete("/:id/members/:memberId", removeOrganizationMember); // Remove member from a specific organization

// Future routes (might not be needed for MVP)
router.get("/", getOrganizations);
router.get("/:id", getOrganizationById);

module.exports = router;
