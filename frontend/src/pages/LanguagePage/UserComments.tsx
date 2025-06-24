import { useState, useEffect, type FormEvent } from "react";
import { useOutletContext } from "react-router-dom";
import type { User, Comment } from "../../type";

type ContextType = {
  user: User | null;
  languageId: number;
};

type Props = {
  languageId: number;
};

export default function UserComments({ languageId }: Props) {
  const { user } = useOutletContext<ContextType>();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  // Fetch Comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/comment/${languageId}`
        );
        const data = await res.json();

        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchComments();
  }, [languageId]);

  // Create new comment
  const handlePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch("http://localhost:4000/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ languageId, content: newComment }),
      });

      const data = await res.json();
      setComments((prev) => [data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  // Delete comment
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Delete this comment?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:4000/api/comment/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // Edit comment
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingContent.trim() || editingId === null) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/comment/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ content: editingContent }),
        }
      );

      const updated = await res.json();
      setComments((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setEditingId(null);
      setEditingContent("");
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  // Toggle Like
  const toggleLike = async (commentId: number) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/comment/${commentId}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                likesCount: data.liked ? c.likesCount + 1 : c.likesCount - 1,
              }
            : c
        )
      );
    } catch (err) {
      console.error("Failed to toggle/untoggle like:", err);
    }
  };

  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {/* POST Comment */}
      {user && (
        <form onSubmit={handlePost} className="mb-6">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md resize-none dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
            rows={3}
            maxLength={300}
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Post
          </button>
        </form>
      )}

      {/* Comment list */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-4 border border-gray-200 rounded-md dark:bg-zinc-900 dark:border-zinc-700"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                by{" "}
                <strong className="text-gray-700 dark:text-white">
                  {c.username}
                </strong>
              </span>
              <span className="text-sm text-gray-400">
                {new Date(c.updatedAt).toLocaleString()}
                {c.updatedAt !== c.createdAt && " (edited)"}
              </span>
            </div>

            {/* EDIT */}
            {editingId === c.id ? (
              <form onSubmit={handleEdit}>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  rows={3}
                  className="w-full p-2 rounded-md border dark:bg-zinc-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="mt-1 mr-2 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEditingContent("");
                  }}
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p className="text-gray-200 mb-2">{c.content}</p>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  {user && (
                    <>
                      <button
                        onClick={() => toggleLike(c.id)}
                        className="hover:text-blue-400 cursor-pointer"
                      >
                        👍 Like
                      </button>
                      <span>{c.likesCount}</span>
                    </>
                  )}
                  {user?.username === c.username && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(c.id);
                          setEditingContent(c.content);
                        }}
                        className="hover:text-yellow-500 cursor-pointer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
