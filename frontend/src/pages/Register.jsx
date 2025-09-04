import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await register(email, password);
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-teal-50 to-blue-50 flex items-center justify-center px-6">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-5xl w-full">
        {/* Left descriptive panel */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Start your journey with WealthEdge.</h1>
          <p className="text-gray-600">
            Create an account to track your expenses, monitor categories, and build your investing plan.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li>🟢 Track daily expenses with clean summaries</li>
            <li>🔵 See spending by category and over time</li>
            <li>🟠 Log investing contributions and progress</li>
          </ul>
        </div>

        {/* Right register form */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Create your WealthEdge account</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            <button type="submit" className="w-full bg-black text-white py-2 rounded-lg">
              Sign up
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
