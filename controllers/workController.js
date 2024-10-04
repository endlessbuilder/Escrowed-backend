const { WorkSubmission } = require('../models');

// [HTTP POST]
exports.submitWork = async (req, res) => {
  try {
    const { deed_id, file_link, description, userId } = req.body;
    const uploaded_link = req.file ? path.join('uploads', req.file.filename) : null; 
    const submission = await WorkSubmission.create({
      deed_id,
      submitted_by: userId,
      file_link: file_link ? file_link : uploaded_link,
      description,
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [HTTP PATCH]
exports.reviewWork = async (req, res) => {
  try {
    const { deed_id } = req.params;
    const { status } = req.body; // approved, revision_requested, fraud_reported

    const submission = await WorkSubmission.findOne({ where: { deed_id: deed_id } });
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submission.status = status;
    await submission.save();
    res.json(submission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
