import { useNavigate } from "react-router-dom";
import { NotebookPen } from "lucide-react";
import type { Note } from "../../type";

interface NoteSectionProps {
  notes: Note[];
}

export default function NoteSection({ notes }: NoteSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <NotebookPen className="w-6 h-6 text-green-400" />
        My Notes
      </h2>

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
