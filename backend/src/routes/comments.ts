import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { verifyToken } from "../middleware/verifyToken";
import { AuthRequest } from "../types/auth";

const router = Router();

function validateCommentContent(
  content: unknown
): { message: string; status: number } | null {
  if (typeof content !== "string" || content.trim() === "") {
    return { message: "Comment cannot be empty", status: 422 };
  }
  if (content.length > 300) {
    return { message: "Comment cannot exceed 300 characters", status: 413 }; // Payload Too Large
  }
  return null;
}

/* PUBLIC */

// Get all comments for a specific language
router.get("/:languageId", async (req: Request, res: Response) => {
  const languageId = parseInt(req.params.languageId);

  if (isNaN(languageId)) {
    res.status(400).json({ error: "Invalid languageId" });
    return;
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { languageId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { username: true } },
        likes: true,
      },
    });

    const formatted = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      username: comment.user.username,
      likesCount: comment.likes.length,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

/* PROTECTED (Logged-In) */

// Add Comment
router.post("/", verifyToken, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const { languageId, content } = req.body;

  // Check languageId
  const langId = parseInt(languageId);
  if (isNaN(langId)) {
    res.status(400).json({ error: "Invalid languageId" });
    return;
  }

  // Check content
  const validation = validateCommentContent(content);
  if (validation) {
    res.status(validation.status).json({ error: validation.message });
    return;
  }
  const trimmedContent = content.trim();

  try {
    const comment = await prisma.comment.create({
      data: {
        content: trimmedContent,
        userId,
        languageId: langId,
      },
      include: {
        user: { select: { username: true } },
        likes: true,
      },
    });

    const formatted = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      username: comment.user.username,
      likesCount: comment.likes.length,
    };

    res.status(201).json(formatted);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// Edit Comment
router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const commentId = parseInt(req.params.id);
  const { content } = req.body;

  if (isNaN(commentId)) {
    res.status(400).json({ error: "Invalid comment ID" });
    return;
  }

  // Check content
  const validation = validateCommentContent(content);
  if (validation) {
    res.status(validation.status).json({ error: validation.message });
    return;
  }
  const trimmedContent = content.trim();

  try {
    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existing) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    if (existing.userId !== userId) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: trimmedContent },
      include: {
        user: { select: { username: true } },
        likes: true,
      },
    });

    const formatted = {
      id: updated.id,
      content: updated.content,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      username: updated.user.username,
      likesCount: updated.likes.length,
    };

    res.json(formatted);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

// Delete Comment
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const commentId = parseInt(req.params.id);

  try {
    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existing) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    if (existing.userId !== userId) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    // delete
    await prisma.comment.delete({ where: { id: commentId } });

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// Toggle Like
router.patch("/:id/like", verifyToken, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const commentId = parseInt(req.params.id);

  if (isNaN(commentId)) {
    res.status(400).json({ error: "Invalid comment ID" });
    return;
  }

  try {
    const commentExists = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!commentExists) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    const existing = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existing) {
      // remove like
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });

      res.json({ liked: false });
      return;
    } else {
      // add like
      await prisma.commentLike.create({
        data: { userId, commentId },
      });

      res.json({ liked: true });
      return;
    }
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

export default router;
