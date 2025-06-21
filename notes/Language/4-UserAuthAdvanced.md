# 🔐 4 - Advanced User Authentication with JWT and Bcrypt

This step enhances the basic user authentication by adding **secure password hashing** with `bcryptjs`, **stateless sessions** with **JWT tokens**, and **middleware** to protect sensitive API routes.

---

## Table of Contents

Backend Enhancements

- [Password Validation and Hashing](#hashing)
- [JWT Token Generation and Verification](#token)
- [Protected Routes with Middleware](#middleware)

Frontend Changes

- [Storing and Using JWT Token](#usingtoken)
- [Passing JWT in API Requests](#apichanges)
- [Logout and Token Removal](#logout)

[Additional Useful Tips](#tips)

---

## Backend Enhancements

### Password Validation and Hashing {#hashing}

- Passwords are no longer stored in plain text.
- Use `bcryptjs` to hash passwords before saving to the database.
- Added password complexity validation on registration:

  - Minimum 8 characters
  - At least one uppercase, one lowercase, one digit, and one special character.

```ts
const hashedPassword = await bcrypt.hash(password, 10);
await prisma.user.create({ data: { username, password: hashedPassword } });
```

```text
codeatlas=# SELECT * FROM "User";
 id |  username   |                           password
----+-------------+--------------------------------------------------------------  
  1 | arzigogolio | $2b$10$/66B10q9rASoCWZidBSimOwsEbH.ksZ587fUK1.HtZxLY/Jm1sqTy   
  2 | superuser   | $2b$10$SNhMckyIq9Xmyr.B5Vy3OeY0aj/jsOBqhF2OxPTYFlJ.KRL2xmeOa   
```

### JWT Token Generation and Verification {#token}

- Upon successful login or registration, generate a JWT token signed with a secret key.
- The token contains user `id` and `username` and expires after 24 hours.
- Return the token to the frontend.

```ts
const token = jwt.sign({ id: user.id, username }, jwtSecret, { expiresIn: "24h" });
res.json({ username: user.username, token });
```

#### Environment Variable for JWT Secret

Ensure you add the `JWT_SECRET` environment variable both locally and in Docker Compose:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codeatlas
PORT=4000
JWT_SECRET=superSecretTokenKey123
```

```yaml
environment:
  - DATABASE_URL=postgresql://postgres:postgres@db:5432/codeatlas
  - JWT_SECRET=superSecretTokenKey123
  - NODE_ENV=development
  - PORT=4000
```

This secret key is used to sign and verify JWT tokens — keep it safe and do **not** commit it to public repos.

---

### Protected Routes with Middleware {#middleware}

- Created a middleware `verifyToken` that extracts the token from the Authorization header.
- It verifies the token and injects the `userId` into the request object.
- Applied middleware on all user-specific routes to secure them.

```ts
export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing or invalid" });
  try {
    const decoded = jwt.verify(token, jwtSecret);
    (req as AuthRequest).userId = Number(decoded.id);
    next();
  } catch {
    res.status(401).json({ error: "Token invalid or expired" });
  }
}
```

---

## Frontend Changes

### Storing and Using JWT Token {#usingtoken}

- On login/register, store the JWT token separately in `localStorage`.
- Keep user info stored for display but use the token for authorization headers.

```tsx
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data));
```

### Passing JWT in API Requests {#apichanges}

- For all user-specific API calls, include the token in the `Authorization` header:

```tsx
fetch("http://localhost:4000/api/user/favorites", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
```

### Logout and Token Removal {#logout}

- On logout, remove both user info and token from `localStorage`:

```tsx
localStorage.removeItem("user");
localStorage.removeItem("token");
setUser(null);
```

---

## Additional Useful Tips {#tips}

### 1. Cleaning Previous Test Data

Before starting, you might want to clear existing data from the database:

```bash
docker exec -it codeatlas-db psql -U postgres -d codeatlas

# Clean all relevant tables and reset IDs
TRUNCATE TABLE "FavoriteLanguage", "Note", "User" RESTART IDENTITY CASCADE;
```

This helps avoid conflicts from old test data, e.g., duplicate usernames or favorites.

---

### 2. Understanding the Password Regex

The password complexity check uses this regex:

```js
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
```

- `/.../` → pattern delimiters
- `^` → start of string
- `(?=.*[a-z])` → requires **at least one lowercase letter** anywhere
- `(?=.*[A-Z])` → requires **at least one uppercase letter** anywhere
- `(?=.*\d)` → requires **at least one digit (0-9)** anywhere
- `(?=.*[!@#$%^&*])` → requires **at least one special character** from this set
- `.{8,}` → matches **any character** at least 8 times (minimum length)
- `$` → end of string

✅ This ensures the password contains at least one lowercase, one uppercase, one number, one special character, and is at least 8 characters long.
