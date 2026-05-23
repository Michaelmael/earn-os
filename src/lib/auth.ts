import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'src/data/users.json');
const RESET_CODES_FILE = path.join(process.cwd(), 'src/data/reset-codes.json');
const ADMIN_CONFIG_FILE = path.join(process.cwd(), 'src/data/admin-config.json');

const ADMIN_EMAIL = 'michaelmbugua920@gmail.com';
const DEFAULT_ADMIN_PASSWORD = '24776543509060434';

interface User {
  email: string;
  password: string;
  verified: boolean;
  lastLogin: string;
  visitCount: number;
  isAdmin: boolean;
  createdAt: string;
}

interface AdminConfig {
  password: string;
  lastChanged: string;
}

let currentCodeNum = 2000;
let currentCodeLetter = 'a';

function getAdminConfig(): AdminConfig {
  try {
    return JSON.parse(fs.readFileSync(ADMIN_CONFIG_FILE, 'utf-8'));
  } catch {
    const defaultConfig: AdminConfig = {
      password: DEFAULT_ADMIN_PASSWORD,
      lastChanged: new Date().toISOString(),
    };
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
}

function saveAdminConfig(config: AdminConfig): void {
  fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2));
}

function getUsers(): User[] {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); }
  catch { return []; }
}

function saveUsers(users: User[]): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function getResetCodes(): { email: string; code: string; expires: number }[] {
  try { return JSON.parse(fs.readFileSync(RESET_CODES_FILE, 'utf-8')); }
  catch { return []; }
}

function saveResetCodes(codes: { email: string; code: string; expires: number }[]): void {
  fs.writeFileSync(RESET_CODES_FILE, JSON.stringify(codes, null, 2));
}

export function findUser(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  if (password.length < 5) return { success: false, error: 'Password must be at least 5 characters' };
  if (findUser(email)) return { success: false, error: 'Email already registered' };
  const users = getUsers();
  const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const newUser: User = {
    email: email.toLowerCase(),
    password,
    verified: false,
    lastLogin: new Date().toISOString(),
    visitCount: 0,
    isAdmin,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

export function verifyUserEmail(email: string): void {
  const users = getUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx >= 0) {
    users[idx].verified = true;
    saveUsers(users);
  }
}

export function loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const user = findUser(email);
  if (!user) return { success: false, error: 'Account not found. Please sign up.' };
  if (!user.verified) return { success: false, error: 'Please verify your email first.' };
  if (user.password !== password) return { success: false, error: 'Incorrect password' };
  user.lastLogin = new Date().toISOString();
  user.visitCount += 1;
  const users = getUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  users[idx] = user;
  saveUsers(users);
  return { success: true, user };
}

export function adminLogin(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const config = getAdminConfig();
  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return { success: false, error: 'Invalid admin credentials' };
  }
  if (password !== config.password) {
    return { success: false, error: 'Invalid admin credentials' };
  }
  let user = findUser(email);
  if (!user) {
    const result = createUser(email, password);
    if (result.success && result.user) {
      user = result.user;
      user.verified = true;
      const users = getUsers();
      const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      users[idx] = user;
      saveUsers(users);
    }
  }
  if (user) {
    user.lastLogin = new Date().toISOString();
    user.visitCount += 1;
    if (!user.verified) user.verified = true;
    const users = getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    users[idx] = user;
    saveUsers(users);
  }
  return { success: true, user: user! };
}

export function changeAdminPassword(newPassword: string): { success: boolean; error?: string } {
  if (newPassword.length < 8) return { success: false, error: 'Admin password must be at least 8 characters' };
  const config = getAdminConfig();
  const lastChanged = new Date(config.lastChanged);
  const now = new Date();
  const daysSinceChange = (now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceChange < 30) {
    const daysLeft = Math.ceil(30 - daysSinceChange);
    return { success: false, error: `Password can only be changed once per month. ${daysLeft} days remaining.` };
  }
  config.password = newPassword;
  config.lastChanged = now.toISOString();
  saveAdminConfig(config);
  return { success: true };
}

export function getAdminPasswordLastChanged(): string {
  return getAdminConfig().lastChanged;
}

export function generateResetCode(): string {
  const code = `${currentCodeNum}${currentCodeLetter}`;
  currentCodeNum -= 1;
  currentCodeLetter = String.fromCharCode(currentCodeLetter.charCodeAt(0) + 1);
  if (currentCodeLetter > 'z') currentCodeLetter = 'a';
  return code;
}

export function storeResetCode(email: string, code: string): void {
  const codes = getResetCodes().filter(c => c.email !== email.toLowerCase());
  codes.push({ email: email.toLowerCase(), code, expires: Date.now() + 15 * 60 * 1000 });
  saveResetCodes(codes);
}

export function verifyResetCode(email: string, code: string): boolean {
  const codes = getResetCodes();
  const found = codes.find(c => c.email === email.toLowerCase() && c.code === code && c.expires > Date.now());
  if (found) {
    saveResetCodes(codes.filter(c => c !== found));
    return true;
  }
  return false;
}

export function updatePassword(email: string, newPassword: string): { success: boolean; error?: string } {
  if (newPassword.length < 5) return { success: false, error: 'Password must be at least 5 characters' };
  const users = getUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx < 0) return { success: false, error: 'User not found' };
  users[idx].password = newPassword;
  saveUsers(users);
  return { success: true };
}

export function getAllUsers(): User[] { return getUsers(); }

export function getActiveUsers(): User[] {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  return getUsers().filter(u => u.lastLogin > oneHourAgo);
}