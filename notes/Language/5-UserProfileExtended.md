# 👤 5 - User Profile and Extended Registration

In this step, we expanded the user model to include more personal information and implemented a user profile management flow with protected routes on the frontend and backend.

---

## Table of Contents

Backend Changes

- [Extended User Model with Prisma](#prisma-model)
- [Profile Routes: User Deletion](#profile-routes)
- [Extended Registration Endpoint](#register-endpoint)

Frontend Changes

- [Protected Routes and Profile Page](#protected-routes)
- [Profile Page](#profile-page)
- [SignIn Component Update](#signin-update)

---

## Backend Changes

### Extended User Model with Prisma {#prisma-model}

We updated the Prisma `User` model to include new fields for richer user data:

```prisma
model User {
  id         Int                @id @default(autoincrement())
  username   String             @unique
  password   String
  email      String             @unique
  firstName  String?
  lastName   String?
  birthDate  DateTime
  newsletter Boolean            @default(false)
  favorite   FavoriteLanguage[]
  Note       Note[]
}

model FavoriteLanguage {
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Note {
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Additionally, we configured **cascade deletion** on related entities (e.g., notes, favorites) linked to the user to maintain database integrity when deleting a user.

---

### Profile Routes: User Deletion {#profile-routes}

We created a new `profile.ts` router that allows users to delete their account by id, ensuring a clean and secure user lifecycle management.

```ts
import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { AuthRequest } from "../types/auth";

const router = Router();

router.delete("/", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  try {
    await prisma.user.delete({ where: { id: userId } });
    res.status(200).json({ message: "User and related data deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
```

---

### Extended Registration Endpoint {#register-endpoint}

The `/register` route was updated to accept and validate the new user fields (`email`, `firstName`, `lastName`, `birthDate`, `newsletter`), before storing them in the database.

```ts
const { username, password, email, firstName, lastName, birthDate, newsletter } = req.body;

// Basic validation...

const newUser = await prisma.user.create({
  data: {
    username,
    password: hashedPassword,
    email,
    firstName,
    lastName,
    birthDate: new Date(birthDate),
    newsletter: Boolean(newsletter),
  },
});
```

---

## Frontend Changes

### Protected Routes and Profile Page {#protected-routes}

To protect sensitive user routes, we enhanced the router with guarded routes that check for an authenticated user before rendering the Profile page.

```tsx
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../utils/UserContext";

export function ProtectedRoute() {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  if (!user) {
    // Not Logged In → Home
    return <Navigate to="/" replace />;
  }

  // Logged In → Profile
  return <Outlet />;
}
```

The new **Profile** page shows personal user info and offers account management actions like account deletion.

---

### 👤 Profile Page {#profile-page}

The `Profile` page displays the full set of user data collected during registration.

```tsx
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";

export default function Profile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Deleting error");

      logout();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error deleting account.");
    }
  };

  if (!user) return null; // safety

  return (
    <div>
      <h1>Your Profile</h1>

      <div>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>First Name: {user.firstName || "Not specified"}</p>
        <p>Last Name: {user.lastName || "Not specified"}</p>
        <p>
          Date of birth:{" "}
          {user.birthDate
            ? new Date(user.birthDate).toLocaleDateString()
            : "Not specified"}
        </p>
        <p>
          Newsletter:{" "}
          {user.newsletter ? "Registered" : "Not registered"}
        </p>
      </div>

      <button onClick={handleDelete} >
        Delete Account
      </button>
    </div>
  );
}
```

At the bottom of the page, a **"Delete Account"** button allows users to permanently remove their account. This triggers a `DELETE` request to the backend, passing the JWT for authentication. Upon success, the user is logged out and redirected to the homepage.

---

### SignIn Component Update {#signin-update}

The SignIn component form was updated to collect all the new user fields during registration, including input validation hints for better UX.

```tsx
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [email, setEmail] = useState("");
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [birthDate, setBirthDate] = useState("");
const [newsletter, setNewsletter] = useState(false);
```

On submission, these fields are sent along with username and password to the backend `/register` endpoint, where input validation and sanitization are also enforced to ensure data integrity and security.
