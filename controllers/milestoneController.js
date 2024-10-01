const { DeedMilestone } = require('../models');

// [HTTP PATCH]
exports.updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const milestone = await DeedMilestone.findByPk(id);
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    milestone.status = status;
    await milestone.save();
    res.json(milestone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [HTTP GET]
exports.getMilestones = async (req, res) => {
  try {
    const { deed_id } = req.params; // get from deed id
    const milestones = await DeedMilestone.findAll({
      where: {
        deed_id
      },
    });
    if (!milestones) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    res.json(milestones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};