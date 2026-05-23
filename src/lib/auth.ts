import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'src/data/users.json');
const RESET_CODES_FILE = path.join(process.cwd(), 'src/data/reset-codes.json');

interface User {
  email: string;
  verified: boolean;
  lastLogin: string;
  visitCount: number;
  isAdmin: boolean;
}

let currentCodeNum = 2000;
let currentCodeLetter = 'a';

export function getUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function findUser(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function addOrUpdateUser(email: string): User {
  const users = getUsers();
  const existing = findUser(email);
  if (existing) {
    existing.lastLogin = new Date().toISOString();
    existing.visitCount += 1;
    saveUsers(users);
    return existing;
  }
  const newUser: User = {
    email: email.toLowerCase(),
    verified: false,
    lastLogin: new Date().toISOString(),
    visitCount: 1,
    isAdmin: users.length === 0,
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function verifyUser(email: string): void {
  const users = getUsers();
  const user = findUser(email);
  if (user) { user.verified = true; saveUsers(users); }
}

export function getAllUsers(): User[] { return getUsers(); }

export function getActiveUsers(): User[] {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  return getUsers().filter((u) => u.lastLogin > oneHourAgo);
}

export function generateResetCode(): string {
  const code = `${currentCodeNum}${currentCodeLetter}`;
  currentCodeNum -= 1;
  currentCodeLetter = String.fromCharCode(currentCodeLetter.charCodeAt(0) + 1);
  if (currentCodeLetter > 'z') currentCodeLetter = 'a';
  return code;
}

export function storeResetCode(email: string, code: string): void {
  let codes = [];
  try { codes = JSON.parse(fs.readFileSync(RESET_CODES_FILE, 'utf-8')); } catch {}
  codes = codes.filter((c: any) => c.email !== email.toLowerCase());
  codes.push({ email: email.toLowerCase(), code, expires: Date.now() + 15 * 60 * 1000 });
  fs.writeFileSync(RESET_CODES_FILE, JSON.stringify(codes, null, 2));
}

export function verifyResetCode(email: string, code: string): boolean {
  let codes = [];
  try { codes = JSON.parse(fs.readFileSync(RESET_CODES_FILE, 'utf-8')); } catch {}
  const found = codes.find((c: any) => c.email === email.toLowerCase() && c.code === code && c.expires > Date.now());
  if (found) {
    codes = codes.filter((c: any) => c !== found);
    fs.writeFileSync(RESET_CODES_FILE, JSON.stringify(codes, null, 2));
    return true;
  }
  return false;
}