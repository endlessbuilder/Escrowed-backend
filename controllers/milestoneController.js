const { DeedMilestone } = require('../models');

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
