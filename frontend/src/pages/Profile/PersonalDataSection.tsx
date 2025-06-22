import { useUser } from "../../utils/UserContext";

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
    <section>
      <h2 className="text-2xl font-bold mb-4">📋 Personal Data</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Newsletter:</strong>{" "}
        {user.newsletter ? "Registered" : "Not registered"}
      </p>
      <p>
        <strong>First Name:</strong> {user.firstName || "Not specified"}
      </p>
      <p>
        <strong>Last Name:</strong> {user.lastName || "Not specified"}
      </p>
      <p>
        <strong>Date of birth: </strong>
        {new Date(user.birthDate).toLocaleDateString()}
      </p>

      <div className="mt-4 space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Change Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
          <button
            onClick={handleEmailChange}
            className="mt-2 px-4 py-2 bg-blue-600 rounded"
          >
            Update Email
          </button>
          {emailMessage && <p className="text-sm mt-1">{emailMessage}</p>}
        </div>

        <div>
          <label className="block mb-1">Newsletter Subscription</label>
          <p className="mb-1">
            You are currently{" "}
            <strong>
              {newsletterStatus ? "subscribed" : "not subscribed"}
            </strong>
          </p>
          <button
            onClick={handleNewsletterToggle}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            {newsletterStatus ? "Unsubscribe" : "Subscribe"}
          </button>
          {newsletterMessage && (
            <p className="text-sm mt-1">{newsletterMessage}</p>
          )}
        </div>
      </div>
    </section>
  );
}
