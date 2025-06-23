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
  newFirstName: string;
  setNewFirstName: (name: string) => void;
  newLastName: string;
  setNewLastName: (name: string) => void;
  nameMessage: string;
  setNameMessage: (msg: string) => void;
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
  newFirstName,
  setNewFirstName,
  newLastName,
  setNewLastName,
  nameMessage,
  setNameMessage,
}: PersonalDataProps) {
  const { user, setUser } = useUser();
  if (!user) return null;

  // Change Email
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

  // Toggle Newsletter
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

  // Change First/Last name
  const handleNameChange = async () => {
    const trimmedFirstName = newFirstName.trim();
    const trimmedLastName = newLastName.trim();

    if (
      (trimmedFirstName !== "" && trimmedFirstName.length > 15) ||
      (trimmedLastName !== "" && trimmedLastName.length > 15)
    ) {
      setNameMessage("First or Last name too long (max 15 characters)");
      return;
    }

    const body: { firstName?: string; lastName?: string } = {};
    if (trimmedFirstName !== "") body.firstName = trimmedFirstName;
    if (trimmedLastName !== "") body.lastName = trimmedLastName;

    if (Object.keys(body).length === 0) {
      setNameMessage("Please enter a first or last name to update.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/profile/name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unkown error");

      setUser({ ...user, ...data });
      localStorage.setItem("user", JSON.stringify({ ...user, ...data }));
      setNameMessage("Name updated");
    } catch (err) {
      setNameMessage(`${err}`);
    }
  };

  return (
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ClipboardList className="w-6 h-6" /> Personal Data
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

      {/* Name Update Form */}
      <div className="bg-gray-700 p-4 rounded-xl mb-6">
        <h3 className="text-xl font-semibold mb-2">Update Name</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full p-2 rounded"
          />
          <input
            type="text"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full p-2 rounded"
          />
          <button
            onClick={handleNameChange}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white cursor-pointer"
          >
            Update Name
          </button>
          {nameMessage && (
            <p
              className={`text-sm ${
                nameMessage.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {nameMessage}
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
