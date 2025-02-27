const { Deed, DeedMilestones } = require("../models");
const { Op } = require("sequelize"); // Import Sequelize operators

// Create a deed
// [HTTP POST]
exports.createDeed = async (req, res) => {
  console.log(">>> create deed API");
  try {
    const {
      user_id,
      title,
      description,
      payment_method,
      payment_type,
      milestones,
      buy_sell_type,
    } = req.body;

    console.log(
      `>>> title: ${title} description: ${description} payment_method: ${payment_method} payment_type: ${payment_type} milestones: ${milestones} paySellType: ${buy_sell_type}`
    );

    const deed = await Deed.create({
      title,
      description,
      payment_method,
      payment_type,
      amount: milestones[0].amount,
      timeline: parseInt(milestones[0].expectedTime),
      seller_id: buy_sell_type == "SELL" ? user_id : null,
      buyer_id: buy_sell_type == "BUY" ? user_id : null,
      status: "pending", // Default status for new deeds
      category: "Billing",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`>>> deed: ${deed}`);

    if (payment_type === "milestone") {
      for (const milestone of milestones) {
        await DeedMilestones.create({
          name: milestone.milestone,
          amount: parseFloat(milestone.amount),
          timeline: parseInt(milestone.timeline),
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
          deed_id: deed.id,
        });
      }
    }

    res.status(201).json(deed);
  } catch (error) {
    console.log(">>> error : ", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all deeds
// [HTTP GET]
exports.getAllDeeds = async (req, res) => {
  try {
    const deeds = await Deed.findAll();
    return res.status(200).json(deeds);
  } catch (error) {
    console.error("Error fetching deeds:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a deed by ID
// [HTTP GET]
exports.getDeedById = async (req, res) => {
  try {
    const deedId = req.params.id;
    const deed = await Deed.findOne({
      where: { id: deedId },
      include: [
        {
          model: DeedMilestones,
          as: "milestones", // Use the alias if defined in associations
          required: false, // This allows the deed to be returned even if it has no milestones
        },
      ],
    });

    if (!deed) {
      return res.status(404).json({ message: "Deed not found" });
    }
    return res.status(200).json(deed);
  } catch (error) {
    console.error("Error fetching deed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a deed by userId
// [HTTP GET]
exports.getDeedByUserId = async (req, res) => {
  console.log(">>> Get Deed by userId API");
  try {
    const userId = req.params.id;
    const deed = await Deed.findAll({
      where: {
        [Op.or]: [
          { buyer_id: userId }, // First condition
          { seller_id: userId }, // Second condition
        ],
      },
      include: [
        {
          model: DeedMilestones,
          as: "milestones", // Use the alias if defined in associations
          required: false, // This allows the deed to be returned even if it has no milestones
        },
      ],
    });

    if (!deed) {
      return res.status(404).json({ message: "Deed not found" });
    }
    return res.status(200).json(deed);
  } catch (error) {
    console.error("Error fetching deed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a deed
// [HTTP PATCH]
exports.updateDeed = async (req, res) => {
  try {
    const deedId = req.params.id;
    // const deed = await Deed.findOne({ where: { id: deedId } });
    const deed = await Deed.findByPk(deedId);
    if (!deed) {
      return res.status(404).json({ message: "Deed not found" });
    }
    await deed.update(req.body);
    return res.status(200).json({ message: "Deed updated successfully", deed });
  } catch (error) {
    console.error("Error updating deed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// In case of buyer, to check its state
// [HTTP POST]
exports.requestFundsBefore = async (req, res) => {
  try {
    const { user_id, deed_id, milestone_id } = req.body;
    const deed = await Deed.findByPk(deed_id);

    if (!deed) {
      return res.status(404).json({ error: "Deed not found" });
    }

    // Check if the caller is the buyer
    if (user_id !== deed.buyer_id) {
      return res
        .status(403)
        .json({ error: "Only the buyer can request funds." });
    }

    if (milestone_id) {
      // Check if the milestone exists
      const milestone = await DeedMilestones.findByPk(milestone_id);
      if (!milestone || milestone.deed_id !== deed_id) {
        return res
          .status(404)
          .json({ error: "Milestone not found for this deed." });
      }

      // Check if the milestone status allows requesting funds
      if (milestone.status !== "pending") {
        return res.status(400).json({
          error:
            "Funds have already been requested or released for this milestone.",
        });
      }
      res.json({
        message: "Funds requested successfully for the milestone.",
        milestone,
      });
    } else {
      res.json({ message: "Complete payment requested successfully.", deed });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// In case of buyer, to save its updated state
// [HTTP POST]
exports.requestFundsAfter = async (req, res) => {
  try {
    const { user_id, deed_id, milestone_id } = req.body;
    const deed = await Deed.findByPk(deed_id);

    if (!deed) {
      return res.status(404).json({ error: "Deed not found" });
    }

    // Check if the caller is the buyer
    if (user_id !== deed.buyer_id) {
      return res
        .status(403)
        .json({ error: "Only the buyer can request funds." });
    }

    if (milestone_id) {
      // Check if the milestone exists
      const milestone = await DeedMilestones.findByPk(milestone_id);
      if (!milestone || milestone.deed_id !== deed_id) {
        return res
          .status(404)
          .json({ error: "Milestone not found for this deed." });
      }

      // Check if the milestone status allows requesting funds
      if (milestone.status !== "pending") {
        return res.status(400).json({
          error:
            "Funds have already been requested or released for this milestone.",
        });
      }

      // Change milestone status to "requested"
      milestone.status = "requested";
      await milestone.save();
      res.json({
        message: "Funds requested successfully for the milestone.",
        milestone,
      });
    } else {
      // Release complete payment
      deed.status = "completed"; // Change deed status to completed
      await deed.save();
      res.json({ message: "Complete payment requested successfully.", deed });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// In case of Seller, to check its state
// [HTTP POST]
exports.releaseFundsBefore = async (req, res) => {
  try {
    const { user_id, deed_id, milestone_id } = req.body;
    const deed = await Deed.findByPk(deed_id);

    if (!deed) {
      return res.status(404).json({ error: "Deed not found" });
    }

    // Check if the caller is the seller
    if (user_id !== deed.seller_id) {
      return res
        .status(403)
        .json({ error: "Only the seller can release funds." });
    }

    if (milestone_id) {
      // Release funds for a specific milestone
      const milestone = await DeedMilestones.findByPk(milestone_id);
      if (!milestone || milestone.deed_id !== deed_id) {
        return res
          .status(404)
          .json({ error: "Milestone not found for this deed." });
      }

      // Check if the funds have been requested for this milestone
      if (milestone.status !== "requested") {
        return res
          .status(400)
          .json({ error: "Funds have not been requested for this milestone." });
      }
      res.json({
        message: "Milestone funds released successfully.",
        milestone,
      });
    } else {
      res.json({ message: "Complete payment released successfully.", deed });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// In case of Seller, to save updated the state
// [HTTP POST]
exports.releaseFundsAfter = async (req, res) => {
  try {
    const { user_id, deed_id, milestone_id } = req.body;
    const deed = await Deed.findByPk(deed_id);

    if (!deed) {
      return res.status(404).json({ error: "Deed not found" });
    }

    // Check if the caller is the seller
    if (user_id !== deed.seller_id) {
      return res
        .status(403)
        .json({ error: "Only the seller can release funds." });
    }

    if (milestone_id) {
      // Release funds for a specific milestone
      const milestone = await DeedMilestones.findByPk(milestone_id);
      if (!milestone || milestone.deed_id !== deed_id) {
        return res
          .status(404)
          .json({ error: "Milestone not found for this deed." });
      }

      // Check if the funds have been requested for this milestone
      if (milestone.status !== "requested") {
        return res
          .status(400)
          .json({ error: "Funds have not been requested for this milestone." });
      }

      // Change milestone status to "released"
      milestone.status = "released";
      await milestone.save();
      res.json({
        message: "Milestone funds released successfully.",
        milestone,
      });
    } else {
      // Release complete payment
      deed.status = "completed"; // Change deed status to completed
      await deed.save();
      res.json({ message: "Complete payment released successfully.", deed });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [HTTP GET]
exports.getMilestonesByDeedId = async (req, res) => {
  try {
    const { deed_id } = req.params;

    // Find the deed to ensure it exists
    const deed = await Deed.findByPk(deed_id);
    if (!deed) {
      return res.status(404).json({ error: "Deed not found" });
    }

    // Retrieve milestones associated with the deed
    const milestones = await DeedMilestones.findAll({
      where: { deed_id },
    });

    // If there are no milestones, return a message
    if (milestones.length === 0) {
      return res
        .status(404)
        .json({ message: "No milestones found for this deed." });
    }

    res.json(milestones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//[HTTP PATCH]
exports.updateMilestoneByMilestoneId = async (req, res) => {
  try {
    const { milestone_id } = req.params;
    const { milestone_name, amount, timeline, status } = req.body;

    // Find the milestone to ensure it exists
    const milestone = await DeedMilestones.findByPk(milestone_id);
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    // Update milestone details
    if (milestone_name) milestone.name = milestone_name;
    if (amount) milestone.amount = amount;
    if (timeline) milestone.timeline = timeline;
    if (status) milestone.status = status;

    await milestone.save();

    res.json({ message: "Milestone updated successfully.", milestone });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
