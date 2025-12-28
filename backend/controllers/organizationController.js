const Organization = require("../models/Organization");
const User = require("../models/User");
const { generateToken } = require("./authController");

// ... (existing exports like createOrganization, getOrganizations, getOrganizationById) ...

// @desc    Get user's organization and its members
// @route   GET /api/organizations/my
// @access  Private
exports.getMyOrganization = async (req, res) => {
  try {
    if (!req.user.organization) {
      return res
        .status(404)
        .json({ message: "User is not part of any organization." });
    }

    // Populate both owner and members with name and email
    const organization = await Organization.findById(req.user.organization)
      .populate("owner", "name email")
      .populate("members", "name email"); // IMPORTANT: Populate members here

    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    res.status(200).json({
      organization: {
        id: organization._id,
        name: organization.name,
        owner: organization.owner,
        members: organization.members, // Now includes name and email
      },
    });
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a member to an organization
// @route   POST /api/organizations/:id/members
// @access  Private (Owner only)
exports.addOrganizationMember = async (req, res) => {
  const { email } = req.body;
  const orgId = req.params.id; // Organization ID from URL params
  const currentUserId = req.user.id; // Current user (owner/admin) trying to add member

  try {
    const organization = await Organization.findById(orgId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Check if current user is the owner of this organization
    if (organization.owner.toString() !== currentUserId) {
      return res
        .status(403)
        .json({
          message: "Not authorized to add members to this organization.",
        });
    }

    // Find the user to be added
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res
        .status(404)
        .json({ message: "User with that email not found." });
    }

    // Prevent adding oneself again (owner is already a member)
    if (userToAdd._id.toString() === currentUserId) {
      return res
        .status(400)
        .json({ message: "You are already the owner of this organization." });
    }

    // Check if the user is already a member of this or *any* organization
    // For MVP, one user can only be in one organization.
    if (userToAdd.organization) {
      return res
        .status(400)
        .json({
          message: `User ${userToAdd.name} already belongs to an organization.`,
        });
    }

    // Add user to organization's members array
    organization.members.push(userToAdd._id);
    await organization.save();

    // Update the user's organization field
    userToAdd.organization = organization._id;
    userToAdd.role = "member"; // Assign 'member' role
    await userToAdd.save();

    res.status(200).json({
      message: `${userToAdd.name} added to organization.`,
      organization: organization, // Return updated organization (without populated members yet)
    });
  } catch (error) {
    console.error("Error adding organization member:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Remove a member from an organization
// @route   DELETE /api/organizations/:id/members/:memberId
// @access  Private (Owner only)
exports.removeOrganizationMember = async (req, res) => {
  const orgId = req.params.id;
  const memberIdToRemove = req.params.memberId;
  const currentUserId = req.user.id;

  try {
    const organization = await Organization.findById(orgId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Check if current user is the owner
    if (organization.owner.toString() !== currentUserId) {
      return res
        .status(403)
        .json({
          message: "Not authorized to remove members from this organization.",
        });
    }

    // Prevent owner from removing themselves
    if (memberIdToRemove === currentUserId) {
      return res
        .status(400)
        .json({
          message: "Owner cannot remove themselves from the organization.",
        });
    }

    // Check if memberIdToRemove is actually a member
    const memberIndex = organization.members.indexOf(memberIdToRemove);
    if (memberIndex === -1) {
      return res
        .status(404)
        .json({ message: "Member not found in this organization." });
    }

    // Remove from organization's members array
    organization.members.splice(memberIndex, 1);
    await organization.save();

    // Update the removed user's organization field to null
    const removedUser = await User.findById(memberIdToRemove);
    if (removedUser) {
      removedUser.organization = null;
      removedUser.role = "user"; // Reset role
      await removedUser.save();
    }

    // Optional: Reassign/delete tasks assigned to this user
    // For MVP, we'll leave tasks as is, but in a real app,
    // you'd reassign or mark tasks as unassigned.

    res.status(200).json({
      message: "Member removed from organization.",
      organization: organization, // Return updated organization
    });
  } catch (error) {
    console.error("Error removing organization member:", error);
    res.status(500).json({ message: "Server error" });
  }
};
