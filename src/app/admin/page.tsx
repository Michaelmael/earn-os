'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllUsers, getActiveUsers, changeAdminPassword } from '@/lib/auth';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('earnos_user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.isAdmin) {
        setIsAdmin(true);
        setUsers(getAllUsers());
        setActiveUsers(getActiveUsers());
      } else router.push('/login');
    } else router.push('/login');
  }, []);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const result = changeAdminPassword(newPassword);
    if (result.success) { setMsg('Password changed!'); setNewPassword(''); }
    else setErr(result.error || 'Failed');
  };

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
          <p className="text-3xl font-bold text-blue-400">{users.reduce((s: number, u: any) => s + u.visitCount, 0)}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Change Admin Password (every 30 days)</h2>
        <form onSubmit={handleChangePassword} className="flex gap-3">
          <input type="password" placeholder="New password (min 8 chars)" value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded text-white" required />
          <button type="submit" className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 rounded font-semibold">Change</button>
        </form>
        {msg && <p className="mt-3 text-green-400">{msg}</p>}
        {err && <p className="mt-3 text-red-400">{err}</p>}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-800">All Users</h2>
        <table className="w-full">
          <thead><tr className="text-left text-gray-400 text-sm border-b border-gray-800">
            <th className="p-3">Email</th><th className="p-3">Verified</th><th className="p-3">Last Login</th><th className="p-3">Visits</th><th className="p-3">Admin</th>
          </tr></thead>
          <tbody>
            {users.map((u: any) => (
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
    </main>
  );
}