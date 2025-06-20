import { useState, useEffect } from "react";

import type { User } from "../../type";

type NoteEditorProps = {
  user: User;
  languageId: number;
};

export default function NoteEditor({ user, languageId }: NoteEditorProps) {
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Fetch existing note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/user/notes?userId=${user.id}&languageId=${languageId}`
        );

        const data = await res.json();
        setNote(data.content || "");
      } catch (err) {
        console.error("Error loading note:", err);
      }
    };

    fetchNote();
  }, [user.id, languageId]);

  // Save note
  const saveNote = async () => {
    setIsSaving(true);
    try {
      await fetch("http://localhost:4000/api/user/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, languageId, content: note }),
      });

      // delay
      const timeout = setTimeout(() => {
        setIsSaving(false);
      }, 800);
      setSaveTimeout(timeout);
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note.");
      setIsSaving(false);
    }
  };

  // clear timeout
  useEffect(() => {
    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, [saveTimeout]);

  return (
    <div className="mt-6">
      <label htmlFor="note" className="block mb-1 font-semibold">
        Your Notes
      </label>
      <textarea
        id="note"
        className="w-full p-2 border rounded resize-none"
        rows={6}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your notes here..."
      />
      <button
        onClick={saveNote}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
