'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  verified: boolean;
  lastLogin: string;
  visitCount: number;
  isAdmin: boolean;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('earnos_user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.isAdmin) { setIsAdmin(true); fetchUsers(); }
      else router.push('/login');
    } else router.push('/login');
    setLoading(false);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.allUsers || []);
      setActiveUsers(data.activeUsers || []);
    } catch {}
  };

  if (loading) return <div className="min-h-screen bg-gray-950 text-white p-8">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-400">Admin Dashboard</h1>
        <button onClick={() => { localStorage.removeItem('earnos_user'); router.push('/login'); }}
          className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-sm">Logout</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-green-400">{users.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm">Active Now</p>
          <p className="text-3xl font-bold text-yellow-400">{activeUsers.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm">Total Visits</p>
          <p className="text-3xl font-bold text-blue-400">{users.reduce((s, u) => s + u.visitCount, 0)}</p>
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-800">All Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-gray-400 text-sm border-b border-gray-800">
              <th className="p-3">Email</th><th className="p-3">Verified</th>
              <th className="p-3">Last Login</th><th className="p-3">Visits</th><th className="p-3">Admin</th>
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.verified ? '✅' : '❌'}</td>
                  <td className="p-3 text-gray-400 text-sm">{new Date(u.lastLogin).toLocaleString()}</td>
                  <td className="p-3">{u.visitCount}</td>
                  <td className="p-3">{u.isAdmin ? '👑' : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}