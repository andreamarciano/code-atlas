import { useNavigate } from "react-router-dom";
import { NotebookPen, Trash2 } from "lucide-react";
import type { Note } from "../../type";

interface NoteSectionProps {
  notes: Note[];
  onDeleteAll: () => void;
}

export default function NoteSection({ notes, onDeleteAll }: NoteSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <NotebookPen className="w-6 h-6 text-green-400" />
          My Notes
        </h2>
        {notes.length > 0 && (
          <button
            onClick={onDeleteAll}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-400 italic">No notes found.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id}>
              <p className="text-sm italic text-gray-300 ">
                “{note.content.slice(0, 50)}...” –{" "}
                <button
                  onClick={() =>
                    navigate(`/language/${note.language.name.toLowerCase()}`)
                  }
                  className="text-blue-400 hover:underline hover:text-blue-300 cursor-pointer"
                >
                  {note.language.name}
                </button>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
