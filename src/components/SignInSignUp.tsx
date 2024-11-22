// SignInSignUp.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { supabase } from "../supabaseClient";
// import { toast } from "sonner";
// import { useSupabaseUser } from "../context/SupabaseUserContext";

export const SignInSignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigateDashboard = () => {
    navigate("/dashboard");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting sign in with email:", email);
    } catch (error) {
      console.error("Sign in error:", error);
      setError(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!fullName.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting sign up for:", email);

      // Reset form and switch to sign-in mode
      setEmail("");
      setPassword("");
      setFullName("");
      setIsSignUp(false);
    } catch (error) {
      console.error("Sign up error:", error);
      setError(error instanceof Error ? error.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverPassword = () => {
    navigate("/recover-password");
  };
  //DETTA LÖSER DU SEN!!!!!
  console.log(handleRecoverPassword);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-[15em] lg:mb-80 bg-[#030714] shadow-2xl shadow-teal-100 rounded-lg p-8 max-w-sm w-[85%] z-10">
        <h2 className="text-center text-2xl font-semibold mb-6">
          {isSignUp ? "Create an account" : "Sign In"}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
          className="space-y-4"
        >
          {isSignUp && (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full p-3 border border-gray-600 rounded focus:outline-none focus:border-gray-400 bg-[#0c111d] text-sm"
              disabled={loading}
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-600 rounded focus:outline-none focus:border-gray-400 bg-[#0c111d] text-sm"
            disabled={loading}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-600 rounded focus:outline-none focus:border-gray-400 bg-[#0c111d] text-sm"
            disabled={loading}
          />

          <button
            type="submit"
            className={`w-full bg-[#25283b] text-white py-3 rounded hover:bg-gray-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-500 space-y-2">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-blue-500 hover:underline"
                disabled={loading}
              >
                Sign In
              </button>
            </p>
          ) : (
            <>
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-blue-500 hover:underline"
                  disabled={loading}
                >
                  Sign Up
                </button>
              </p>
              <p>
                <button
                  onClick={navigateDashboard}
                  className="text-blue-500 hover:underline"
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
