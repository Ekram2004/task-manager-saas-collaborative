    const Organization = require('../models/Organization');
    const User = require('../models/User'); // We need this to update the user's organization

    // @desc    Create new organization
    // @route   POST /api/organizations
    // @access  Private
    exports.createOrganization = async (req, res) => {
      const { name } = req.body;
      const userId = req.user.id; // User ID from auth middleware

      try {
        // Check if organization name already exists
        const existingOrg = await Organization.findOne({ name });
        if (existingOrg) {
          return res
            .status(400)
            .json({ message: "Organization with this name already exists" });
        }

        // Check if the user already owns an organization or is part of one (our current MVP rule)
        if (req.user.organization) {
          return res
            .status(400)
            .json({ message: "You are already part of an organization." });
        }

        // Create organization
        const organization = new Organization({
          name,
          owner: userId,
          members: [userId], // Owner is automatically a member
        });

        await organization.save();

        // Update the user's organization field
        await User.findByIdAndUpdate(userId, {
          organization: organization._id,
          role: "owner",
        });

        // IMPORTANT: Re-issue JWT with organization ID
        // For now, we'll just return the organization, and the frontend will need to handle
        // updating its local user state and potentially getting a new token on next login.
        // A more robust solution involves immediately sending a new token or triggering a re-login.
        // For our MVP, we'll update the frontend user state directly.

        res.status(201).json({
          message: "Organization created successfully",
          organization: {
            id: organization._id,
            name: organization.name,
            owner: organization.owner,
            members: organization.members,
          },
          user: {
            // Send back updated user info so frontend can update its context
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            organization: organization._id,
            role: "owner",
          },
        });
      } catch (error) {
        console.error("Error creating organization:", error);
        res.status(500).json({ message: "Server error" });
      }
    };

    // @desc    Get user's organization
    // @route   GET /api/organizations/my
    // @access  Private
    exports.getMyOrganization = async (req, res) => {
      try {
        if (!req.user.organization) {
          return res
            .status(404)
            .json({ message: "User is not part of any organization." });
        }

        const organization = await Organization.findById(
          req.user.organization
        ).populate("owner", "name email");

        if (!organization) {
          // This case should ideally not happen if user.organization is set, but good for robustness
          return res.status(404).json({ message: "Organization not found." });
        }

        res.status(200).json({
          organization: {
            id: organization._id,
            name: organization.name,
            owner: organization.owner,
            members: organization.members, // We might populate members later
          },
        });
      } catch (error) {
        console.error("Error fetching organization:", error);
        res.status(500).json({ message: "Server error" });
      }
    };

    // Placeholder for getting all organizations (might not be needed for MVP)
    exports.getOrganizations = (req, res) => {
      res.status(200).json({ message: "Get all organizations placeholder" });
    };

    // Placeholder for getting a single organization by ID
    exports.getOrganizationById = (req, res) => {
      res.status(200).json({ message: "Get organization by ID placeholder" });
    };
