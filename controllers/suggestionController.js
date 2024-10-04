const { Suggestion } = require('../models');

exports.getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.findAll();
    res.json(suggestions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.submitSuggestion = async (req, res) => {
  try {
    const { user_id, suggestion } = req.body;

    const newSuggestion = await Suggestion.create({ user_id, suggestion });
    res.status(201).json(newSuggestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSuggestion = async (req, res) => {
  try {
    const { suggestion_id } = req.params;
    const { suggestion, status } = req.body;

    const suggestionEntry = await Suggestion.findByPk(suggestion_id);
    if (!suggestionEntry) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    if (suggestion !== undefined) suggestionEntry.suggestion = suggestion;
    if (status !== undefined) suggestionEntry.status = status;

    await suggestionEntry.save();
    res.json({ message: 'Suggestion updated successfully.', suggestionEntry });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSuggestion = async (req, res) => {
  try {
    const { suggestion_id } = req.params;
    const suggestionEntry = await Suggestion.findByPk(suggestion_id);
    if (!suggestionEntry) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    await suggestionEntry.destroy();
    res.json({ message: 'Suggestion deleted successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};