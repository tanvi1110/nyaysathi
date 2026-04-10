const AUTH_KEY = "nyaysathi_auth";
const USERS_KEY = "nyaysathi_users";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getSession() {
  if (typeof window === "undefined") return null;
  return safeParse(localStorage.getItem(AUTH_KEY) || "null", null);
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

export async function signUp({ name, email, password }) {
  if (typeof window === "undefined") throw new Error("Browser only");
  if (!email || !password) throw new Error("Email and password are required");

  const users = safeParse(localStorage.getItem(USERS_KEY) || "[]", []);
  const normalizedEmail = String(email).trim().toLowerCase();
  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error("An account with this email already exists");
  }

  const passHash = await sha256(password);
  const user = { id: `${Date.now()}`, name: name || normalizedEmail.split("@")[0], email: normalizedEmail, passHash };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const session = { user: { id: user.id, name: user.name, email: user.email }, createdAt: new Date().toISOString() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return session;
}

export async function signIn({ email, password }) {
  if (typeof window === "undefined") throw new Error("Browser only");
  const users = safeParse(localStorage.getItem(USERS_KEY) || "[]", []);
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) throw new Error("No account found for this email");
  const passHash = await sha256(password);
  if (passHash !== user.passHash) throw new Error("Invalid password");

  const session = { user: { id: user.id, name: user.name, email: user.email }, createdAt: new Date().toISOString() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return session;
}

