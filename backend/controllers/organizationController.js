const Organization = require("../models/Organization");
const User = require("../models/User");

/**
 * @desc    Create a new organization
 * @route   POST /api/organizations
 * @access  Private
 */
exports.createOrganization = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Organization name is required" });
    }

    // Prevent user from creating multiple organizations
    if (req.user.organization) {
      return res
        .status(400)
        .json({ message: "User already belongs to an organization" });
    }

    const organization = await Organization.create({
      name,
      owner: req.user.id,
      members: [],
    });

    // Update user as owner
    const user = await User.findById(req.user.id);
    user.organization = organization._id;
    user.role = "owner";
    await user.save();

    res.status(201).json(organization);
  } catch (error) {
    console.error("Create organization error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get logged-in user's organization
 * @route   GET /api/organizations/my
 * @access  Private
 */
exports.getMyOrganization = async (req, res) => {
  try {
    if (!req.user.organization) {
      return res
        .status(404)
        .json({ message: "User is not part of any organization" });
    }

    const organization = await Organization.findById(req.user.organization)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({
      id: organization._id,
      name: organization.name,
      owner: organization.owner,
      members: organization.members,
    });
  } catch (error) {
    console.error("Get my organization error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Add a member to an organization (owner only)
 * @route   POST /api/organizations/:id/members
 * @access  Private
 */
exports.addOrganizationMember = async (req, res) => {
  const { email } = req.body;
  const orgId = req.params.id;

  try {
    const organization = await Organization.findById(orgId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Only owner can add members
    if (organization.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to add members" });
    }

    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToAdd.organization) {
      return res
        .status(400)
        .json({ message: "User already belongs to an organization" });
    }

    organization.members.push(userToAdd._id);
    await organization.save();

    userToAdd.organization = organization._id;
    userToAdd.role = "member";
    await userToAdd.save();

    res.status(200).json({
      message: `${userToAdd.name} added to organization`,
    });
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Remove a member from an organization (owner only)
 * @route   DELETE /api/organizations/:id/members/:memberId
 * @access  Private
 */
exports.removeOrganizationMember = async (req, res) => {
  const { id: orgId, memberId } = req.params;

  try {
    const organization = await Organization.findById(orgId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Only owner can remove members
    if (organization.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to remove members" });
    }

    // Owner cannot remove themselves
    if (memberId === req.user.id) {
      return res
        .status(400)
        .json({ message: "Owner cannot remove themselves" });
    }

    const index = organization.members.indexOf(memberId);
    if (index === -1) {
      return res.status(404).json({ message: "Member not in organization" });
    }

    organization.members.splice(index, 1);
    await organization.save();

    const removedUser = await User.findById(memberId);
    if (removedUser) {
      removedUser.organization = null;
      removedUser.role = "user";
      await removedUser.save();
    }

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get all organizations (optional / admin)
 * @route   GET /api/organizations
 */
exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(200).json(organizations);
  } catch (error) {
    console.error("Get organizations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get organization by ID
 * @route   GET /api/organizations/:id
 */
exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json(organization);
  } catch (error) {
    console.error("Get organization by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
