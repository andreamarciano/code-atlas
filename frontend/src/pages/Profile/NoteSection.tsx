import { useNavigate } from "react-router-dom";
import type { Note } from "../../type";

interface NoteSectionProps {
  notes: Note[];
}

export default function NoteSection({ notes }: NoteSectionProps) {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">📝 My Notes</h2>
      <ul className="space-y-3">
        {notes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          notes.map((note) => (
            <li key={note.id}>
              <p className="text-sm italic text-gray-300">
                “{note.content.slice(0, 15)}...” –{" "}
                <button
                  onClick={() => navigate(`/language/${note.language.name}`)}
                  className="text-blue-400 hover:underline"
                >
                  {note.language.name}
                </button>
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
