export function NotesSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Notes</h2>
      {/* TODO: Fetch user notes */}
      <ul className="space-y-2">
        <li>
          <div>
            <span className="text-gray-300">JavaScript: </span>
            <a
              href="/language/javascript"
              className="text-blue-400 hover:underline"
            >
              console.log("Hello...
            </a>
          </div>
        </li>
        <li>
          <div>
            <span className="text-gray-300">Python: </span>
            <a
              href="/language/python"
              className="text-blue-400 hover:underline"
            >
              def hello():...
            </a>
          </div>
        </li>
        {/* Map real data here */}
      </ul>
    </div>
  );
}
