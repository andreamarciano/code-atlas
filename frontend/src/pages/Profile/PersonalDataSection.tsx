import { useUser } from "../../utils/UserContext";
import { ClipboardList, CheckCircle, Mail, User, Calendar } from "lucide-react";

interface PersonalDataProps {
  newEmail: string;
  setNewEmail: (email: string) => void;
  emailMessage: string;
  setEmailMessage: (msg: string) => void;
  newsletterStatus: boolean;
  setNewsletterStatus: (val: boolean) => void;
  newsletterMessage: string;
  setNewsletterMessage: (msg: string) => void;
}

export default function PersonalDataSection({
  newEmail,
  setNewEmail,
  emailMessage,
  setEmailMessage,
  newsletterStatus,
  setNewsletterStatus,
  newsletterMessage,
  setNewsletterMessage,
}: PersonalDataProps) {
  const { user, setUser } = useUser();
  if (!user) return null;

  const handleEmailChange = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/profile/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setUser({ ...user, email: data.email });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, email: data.email })
      );
      setEmailMessage("Email updated successfully");
    } catch (err) {
      setEmailMessage(`${err}`);
    }
  };

  const handleNewsletterToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/profile/newsletter", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newsletter: !newsletterStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setNewsletterStatus(data.newsletter);
      setUser({ ...user, newsletter: data.newsletter });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, newsletter: data.newsletter })
      );
      setNewsletterMessage("Newsletter preference updated");
    } catch (err) {
      setNewsletterMessage(`${err}`);
    }
  };

  return (
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ClipboardList className="w-6 h-6"/> Personal Data
      </h2>

      {/* User Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            <strong>Email:</strong> {user.email}
          </p>
          <p className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <strong>First Name:</strong> {user.firstName || "Not specified"}
          </p>
          <p className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <strong>Last Name:</strong> {user.lastName || "Not specified"}
          </p>
        </div>
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <strong>Date of Birth:</strong>{" "}
            {new Date(user.birthDate).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle
              className={`w-5 h-5 ${
                user.newsletter ? "text-green-400" : "text-red-400"
              }`}
            />
            <strong>Newsletter:</strong>{" "}
            {user.newsletter ? "Subscribed" : "Not subscribed"}
          </p>
        </div>
      </div>

      {/* Email Update Form */}
      <div className="bg-gray-700 p-4 rounded-xl mb-6">
        <h3 className="text-xl font-semibold mb-2">📨 Update Email</h3>
        <div className="space-y-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
            className="w-full p-2 rounded"
          />
          <button
            onClick={handleEmailChange}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white cursor-pointer"
          >
            Update Email
          </button>
          {emailMessage && (
            <p
              className={`text-sm ${
                emailMessage.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {emailMessage}
            </p>
          )}
        </div>
      </div>

      {/* Newsletter Toggle */}
      <div className="bg-gray-700 p-4 rounded-xl">
        <h3 className="text-xl font-semibold mb-2">
          📰 Newsletter Subscription
        </h3>
        <p className="mb-2">
          You are currently{" "}
          <strong>{newsletterStatus ? "subscribed" : "not subscribed"}</strong>{" "}
          to the newsletter.
        </p>
        <button
          onClick={handleNewsletterToggle}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white cursor-pointer"
        >
          {newsletterStatus ? "Unsubscribe" : "Subscribe"}
        </button>
        {newsletterMessage && (
          <p
            className={`text-sm mt-2 ${
              newsletterMessage.includes("✅")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {newsletterMessage}
          </p>
        )}
      </div>
    </section>
  );
}
