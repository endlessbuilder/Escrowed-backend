const { Faq } = require('../models');

exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await Faq.findAll();
    res.json(faqs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFaq = await Faq.create({ question, answer });
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const { faq_id } = req.params;
    const { question, answer, status } = req.body;

    const currentFaq = await Faq.findByPk(faq_id);
    if (!currentFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    // Update fields if provided
    if (question !== undefined) currentFaq.question = question;
    if (answer !== undefined) currentFaq.answer = answer;
    if (status !== undefined) currentFaq.status = status;

    await currentFaq.save();
    res.json({ message: 'FAQ updated successfully.', currentFaq });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const { faq_id } = req.params;
    const currentFaq = await Faq.findByPk(faq_id);
    if (!currentFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    await currentFaq.destroy();
    res.json({ message: 'FAQ deleted successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};