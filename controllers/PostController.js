import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить посты" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate("user");

    if (!updatedPost) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить пост" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await PostModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось удалить пост" });
  }
};

export const create = async (req, res) => {
  try {
    const { title, text, imageUrl, dueDate } = req.body;

    const doc = new PostModel({
      title: title,
      text: text,
      imageUrl: imageUrl,
      user: req.userId,
      dueDate: dueDate,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, text, imageUrl, status, dueDate } = req.body;
    let completedDate = null;

    if (status === "DONE") {
      completedDate = new Date();
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        title: title,
        text: text,
        imageUrl: imageUrl,
        status: status,
        completedDate: completedDate,
        dueDate: dueDate,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось обновить пост" });
  }
};
