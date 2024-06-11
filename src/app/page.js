"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);
console.log(users);
  useEffect(() => {
    fetch('/api/alluser')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
   hello
      <h1>Users List</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
      <a href="/LoginPage" className="mb-10 block font-bold text-gray-600">
        Have an account? Login
      </a>
    </main>
  );
}
