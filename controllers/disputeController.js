const { Dispute } = require('../models');

exports.createDispute = async (req, res) => {
  try {
    const { deed_id, user_id, reason } = req.body;
    const dispute = await Dispute.create({
      deed_id,
      raised_by: user_id, 
      reason,
    });
    res.status(201).json(dispute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const dispute = await Dispute.findByPk(id);
    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }
    dispute.status = status;
    await dispute.save();
    res.json(dispute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDisputeById = async (req, res) => {
  try {
    const disputeId = req.params.id;
    const dispute = await Dispute.findOne({ where: { deed_id: disputeId } });
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }
    return res.status(200).json(dispute);
  } catch (error) {
    console.error('Error fetching dispute:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};