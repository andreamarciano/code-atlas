# Languages – Documentation Index

- [1 - Navbar: Seeding Languages and Displaying Them in the Navbar](#navbar)
- [2 - Searchbar: Language Lookup and Navigation](#searchbar)
- [3 - User Authentication: Favorites and Personal Notes](#userauth)
- [4 - Advanced User Authentication with JWT and Bcrypt](#userauth-advanced)
- [5 - User Profile and Extended Registration](#user-profile)

---

## 1 - Navbar: Seeding Languages and Displaying Them in the Navbar {#navbar}

Explains how we statically prepopulate the database with supported programming languages using a seed script, and how these are dynamically fetched and displayed in the Navbar component.

📄 [1-Navbar.md](./1-Navbar.md)

---

## 2 - Searchbar: Language Lookup and Navigation {#searchbar}

Details the logic behind making the searchbar functional. Describes the backend route refactor, how the `/api/languages/:name` endpoint works, and how the frontend uses it to navigate to the correct language page or show a "Not Found" view.

📄 [2-Searchbar.md](./2-Searchbar.md)

---

## 3 - User Authentication: Favorites and Personal Notes {#userauth}

Covers the implementation of basic user authentication in the Code Atlas backend using Prisma, Express, and PostgreSQL.  
Also introduces personalized features like favoriting languages and saving notes per user, along with context management and persistent login in the frontend.

📄 [3-UserAuth.md](./3-UserAuth.md)

---

## 4 - Advanced User Authentication with JWT and Bcrypt {#userauth-advanced}

Extends the basic authentication system by introducing:

- Secure password hashing with `bcryptjs`
- Stateless session management via JWT
- Middleware-based route protection
- JWT storage and handling on the frontend

📄 [4-UserAuthAdvanced.md](./4-UserAuthAdvanced.md)

---

## 5 - User Profile and Extended Registration {#user-profile}

This step enriches the user model and implements:

- Extended registration with `email`, `firstName`, `lastName`, `birthDate`, and `newsletter`
- Profile page and guarded frontend routes
- Account deletion flow (backend + frontend)

📄 [5-UserProfileExtended.md](./5-UserProfileExtended.md)
