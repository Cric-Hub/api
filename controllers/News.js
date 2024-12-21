import News from "../models/News.js";

// Create a new news article
export const createNews = async (req, res) => {
  const { title, content, author, image, tags } = req.body;

  try {
    const news = new News({ title, content, author, image, tags });
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all news articles
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single news article by ID
export const getNewsById = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findById(id);
    if (!news) return res.status(404).json({ error: "News not found" });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a news article
export const updateNews = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedNews = await News.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedNews) return res.status(404).json({ error: "News not found" });
    res.status(200).json(updatedNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a news article
export const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) return res.status(404).json({ error: "News not found" });
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
