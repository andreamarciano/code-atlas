import { Search } from "lucide-react";

type SearchbarProps = {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (e: React.FormEvent | React.MouseEvent) => void;
};

export default function Searchbar({
  query,
  setQuery,
  onSearch,
}: SearchbarProps) {
  return (
    <>
      <form
        onSubmit={onSearch}
        className="flex-grow max-w-md mx-6 flex items-center space-x-2 relative"
      >
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-700 bg-neutral-800 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {/* Search Button */}
        <button
          type="button"
          onClick={onSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2 rounded-lg hover:bg-neutral-700 transition cursor-pointer"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </form>
    </>
  );
}
