const db = require("../../../database/index");

const getPostByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    let posts = await db.any(
      `SELECT users.username , full_posts.*
    FROM  (
        SELECT posts.*, array_remove(ARRAY_AGG(tags.tag), NULL) AS tags
        FROM posts
        LEFT JOIN tags ON tags.post_id = posts.id 
        GROUP BY posts.id
        ORDER BY created_at DESC
        ) AS full_posts
     JOIN users ON users.id = full_posts.poster_id
                             WHERE poster_id=$1 ORDER BY created_at DESC`,
      id
    );
    if (posts.length) {
      res.status(200).json({
        status: "ok",
        posts,
        message: "Retrieved all posts by user"
      });
    } else {
      throw { status: 404, error: `User ID: ${id} has no posts` };
    }
  } catch (error) {
    next(error);
  }
};

module.exports = getPostByUser;
