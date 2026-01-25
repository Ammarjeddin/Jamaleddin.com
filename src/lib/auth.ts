import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
const USERS_FILE = path.join(process.cwd(), "content/admin/users.json");

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "admin" | "editor";
  createdAt: string;
}

export interface UserSession {
  id: string;
  username: string;
  email: string;
  role: "admin" | "editor";
}

export interface UsersData {
  users: User[];
}

// Read users from JSON file
function getUsers(): UsersData {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { users: [] };
  }
}

// Save users to JSON file
function saveUsers(data: UsersData): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify a password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Authenticate user
export async function authenticateUser(
  username: string,
  password: string
): Promise<UserSession | null> {
  // Local development fallback
  const isLocalDev = process.env.NODE_ENV === "development";
  if (isLocalDev && username === "admin" && password === "admin") {
    return {
      id: "dev-admin",
      username: "admin",
      email: "admin@localhost",
      role: "admin",
    };
  }

  const { users } = getUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

// Generate JWT token
export function generateToken(user: UserSession): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

// Verify JWT token
export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch {
    return null;
  }
}

// Create a new user (admin only)
export async function createUser(
  username: string,
  email: string,
  password: string,
  role: "admin" | "editor" = "editor"
): Promise<User | null> {
  const data = getUsers();

  // Check if username or email already exists
  const exists = data.users.some(
    (u) => u.username === username || u.email === email
  );
  if (exists) {
    return null;
  }

  const newUser: User = {
    id: String(Date.now()),
    username,
    email,
    passwordHash: await hashPassword(password),
    role,
    createdAt: new Date().toISOString(),
  };

  data.users.push(newUser);
  saveUsers(data);

  return newUser;
}

// Update user password
export async function updatePassword(
  userId: string,
  newPassword: string
): Promise<boolean> {
  const data = getUsers();
  const userIndex = data.users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return false;
  }

  data.users[userIndex].passwordHash = await hashPassword(newPassword);
  saveUsers(data);

  return true;
}

// Get all users (without password hashes)
export function getAllUsers(): Omit<User, "passwordHash">[] {
  const { users } = getUsers();
  return users.map(({ passwordHash, ...user }) => user);
}

// Delete user
export function deleteUser(userId: string): boolean {
  const data = getUsers();
  const initialLength = data.users.length;
  data.users = data.users.filter((u) => u.id !== userId);

  if (data.users.length === initialLength) {
    return false;
  }

  saveUsers(data);
  return true;
}
