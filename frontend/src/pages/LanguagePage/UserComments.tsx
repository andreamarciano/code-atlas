import { useOutletContext } from "react-router-dom";
import type { User } from "../../type";

type ContextType = {
  user: User | null;
};

export default function UserComments() {
  const { user } = useOutletContext<ContextType>();

  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {/* Comment Form (logged-in users) */}
      {user && (
        <form className="mb-6">
          <textarea
            placeholder="Write a comment..."
            className="w-full p-2 border border-gray-300 rounded-md resize-none dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
            rows={3}
            maxLength={250}
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
        {[1, 2, 3].map((comment) => (
          <div
            key={comment}
            className="p-4 border border-gray-200 rounded-md dark:bg-zinc-900 dark:border-zinc-700"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                by{" "}
                <strong className="text-gray-700 dark:text-white">
                  Username
                </strong>
              </span>
              <span className="text-sm text-gray-400">2 hours ago</span>
            </div>
            <p className="text-gray-800 dark:text-gray-100 mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <button className="hover:text-blue-600 transition">
                👍 Like
              </button>
              <span>4</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
