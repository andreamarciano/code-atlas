export function FavoritesSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Favorite Languages</h2>
      {/* TODO: Fetch user's favorite languages */}
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <a
            href="/language/javascript"
            className="text-blue-400 hover:underline"
          >
            JavaScript
          </a>
        </li>
        <li>
          <a href="/language/python" className="text-blue-400 hover:underline">
            Python
          </a>
        </li>
        {/* Map real data here */}
      </ul>
    </div>
  );
}
