type SectionType = "personal" | "account" | "favorites" | "notes";

interface ProfileSidebarProps {
  currentSection: SectionType;
  onSelect: (section: SectionType) => void;
}

const sections: [SectionType, string][] = [
  ["personal", "📋 Personal Data"],
  ["account", "🔐 Account"],
  ["favorites", "⭐ My Favorite Languages"],
  ["notes", "📝 My Notes"],
];

export default function ProfileSidebar({
  currentSection,
  onSelect,
}: ProfileSidebarProps) {
  return (
    <aside className="w-64 pt-20 p-4 bg-gray-800 flex flex-col gap-4 border-r border-gray-700">
      {sections.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`text-left px-3 py-2 rounded cursor-pointer ${
            currentSection === key
              ? "bg-gray-700 text-white font-semibold"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          {label}
        </button>
      ))}
    </aside>
  );
}
