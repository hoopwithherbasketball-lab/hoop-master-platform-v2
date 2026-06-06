import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Lock, AlertCircle } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOGO_URL = "https://customer-assets.emergentagent.com/job_62b58a24-a85f-4363-8413-49d80cc7ae03/artifacts/hutkfplo_fb%20profile%20hoopwithher.png";
const BG_IMAGE = "https://images.unsplash.com/photo-1548813019-ff52accb7a8e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHx3b21lbnMlMjBiYXNrZXRiYWxsJTIwZ2FtZXxlbnwwfHx8fDE3NzUyMzM2MjN8MA&ixlib=rb-4.1.0&q=85";

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, { password });
      if (response.data.success) {
        onLogin();
      }
    } catch (err) {
      setError("Invalid password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Image */}
      <div 
        className="hidden md:block login-bg relative"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-[#1E3A8A]/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <img 
            src={LOGO_URL} 
            alt="HoopWithHer Logo" 
            className="w-48 h-48 object-contain mb-8"
          />
          <h1 className="font-heading text-4xl font-black tracking-tighter text-center mb-4">
            HOOPWITHHER
          </h1>
          <p className="text-lg text-center text-white/90 max-w-md">
            Building leaders, teammates, and confident young women through basketball
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex flex-col items-center justify-center p-8 bg-zinc-50">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile logo */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <img 
              src={LOGO_URL} 
              alt="HoopWithHer Logo" 
              className="w-32 h-32 object-contain mb-4"
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-zinc-900 mb-2">
              Partnership Proposal Builder
            </h2>
            <p className="text-sm text-zinc-500">
              Admin access required to create proposals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                Admin Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pl-10 rounded-sm border-zinc-300 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]"
                  data-testid="login-password-input"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-sm">
                <AlertCircle className="h-4 w-4" />
                <span data-testid="login-error-message">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#1E3A8A] text-white rounded-sm px-6 py-2.5 font-semibold text-sm hover:bg-[#1E3A8A]/90 transition-colors"
              data-testid="login-submit-button"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-400">
            HoopWithHer Girls Basketball
          </p>
        </div>
      </div>
    </div>
  );
}
