import { ClipboardList, Shield, Star, NotebookPen } from "lucide-react";

type SectionType = "personal" | "account" | "favorites" | "notes";

interface ProfileSidebarProps {
  currentSection: SectionType;
  onSelect: (section: SectionType) => void;
}

const sections: {
  key: SectionType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "personal",
    label: "Personal Data",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    key: "account",
    label: "Account",
    icon: <Shield className="w-5 h-5 text-blue-400" />,
  },
  {
    key: "favorites",
    label: "My Favorite Languages",
    icon: <Star className="w-5 h-5 text-yellow-400" />,
  },
  {
    key: "notes",
    label: "My Notes",
    icon: <NotebookPen className="w-5 h-5 text-green-400" />,
  },
];

export default function ProfileSidebar({
  currentSection,
  onSelect,
}: ProfileSidebarProps) {
  return (
    <aside className="w-66 pt-20 p-4 bg-gray-800 flex flex-col gap-4 border-r border-gray-700">
      {sections.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex items-center gap-3 text-left px-3 py-2 rounded cursor-pointer transition-colors ${
            currentSection === key
              ? "bg-gray-700 text-white font-semibold"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </aside>
  );
}
