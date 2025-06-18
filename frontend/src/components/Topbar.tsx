function Topbar() {
  return (
    <div className="bg-neutral-900 px-6 py-3 shadow flex items-center justify-between">
      <div className="text-lg font-bold text-white">Code Atlas</div>

      {/* Search Bar */}
      <div className="flex-grow max-w-md mx-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border border-neutral-700 bg-neutral-800 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="text-sm text-gray-300">🔒 Sign in</div>
    </div>
  );
}

export default Topbar;
