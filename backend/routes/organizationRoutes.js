const express = require("express");
const {
  createOrganization,
  getMyOrganization,
  getOrganizations,
  getOrganizationById,
  addOrganizationMember,
  removeOrganizationMember,
  getOrganizationMembersList, // New import
} = require("../controllers/organizationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createOrganization);
router.get("/my", getMyOrganization);
router.get("/my/members", getOrganizationMembersList); // NEW ROUTE

router.post("/:id/members", addOrganizationMember);
router.delete("/:id/members/:memberId", removeOrganizationMember);

// ... (future/placeholder routes) ...

module.exports = router;
