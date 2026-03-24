import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import { LogIn, Eye, EyeOff, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "motion/react";
import { toast } from "sonner";

export function EntryPortal() {
  const navigate = useNavigate();
  // 🟢 Bring in the new resetPassword function
  const { loginWithEmail, resetPassword, isLoading, loginWithGoogle } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // 🟢 State to toggle between Login and Forgot Password views
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      // Errors are handled inside AuthContext, but we can catch here if needed
    }
  };

  // 🟢 Handle sending the reset email
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }

    try {
      await resetPassword(email);
      toast.success("Reset link sent! Check your email.");
      setIsResetting(false); // Switch back to login view automatically
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafaf9",
        px: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "480px",
            maxWidth: "calc(100vw - 48px)",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "48px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Stack sx={{ gap: "32px" }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#2d5a47",
                fontFamily: "Inter, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              LuppoGrove
            </Typography>

            <Stack sx={{ gap: "8px" }}>
              <Typography
                sx={{
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  lineHeight: 1.3,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {/* 🟢 Change title based on state */}
                {isResetting ? "Reset Password" : "Welcome Back"}
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#6b6b6b",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {isResetting 
                  ? "Enter your email to receive a secure reset link." 
                  : "Sign in to your collaboration portal."}
              </Typography>
            </Stack>

            {isResetting ? (
              // --- FORGOT PASSWORD FORM ---
              <form onSubmit={handleReset} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700 font-medium font-sans">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a47]/50 transition-all font-sans"
                    placeholder="name@organization.com"
                  />
                </div>

                <Button
                  type="submit"
                  disableRipple
                  fullWidth
                  sx={{
                    mt: 2,
                    height: "56px",
                    backgroundColor: "#2d5a47",
                    color: "#ffffff",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#1e3d30" },
                  }}
                >
                  <Mail size={20} className="mr-2" />
                  Send Reset Link
                </Button>

                <button
                  type="button"
                  onClick={() => setIsResetting(false)}
                  className="text-sm text-gray-500 hover:text-[#2d5a47] transition-colors mt-2"
                >
                  Back to Log In
                </button>
              </form>
            ) : (
              // --- STANDARD LOGIN FORM ---
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700 font-medium font-sans">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a47]/50 transition-all font-sans"
                    placeholder="name@organization.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm text-gray-700 font-medium font-sans">
                      Password
                    </label>
                    {/* 🟢 The Forgot Password Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsResetting(true)}
                      className="text-xs text-[#2d5a47] font-medium hover:underline focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative"> 
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a47]/50 transition-all font-sans pr-12"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  disableRipple
                  fullWidth
                  sx={{
                    mt: 2,
                    height: "56px",
                    backgroundColor: "#2d5a47",
                    color: "#ffffff",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#1e3d30" },
                    "&:disabled": { opacity: 0.7 },
                  }}
                >
                  <LogIn size={20} className="mr-2" />
                  {isLoading ? "Signing in..." : "Log In"}
                </Button>
              </form>
            )}

            {/* --- VISUAL DIVIDER --- */}
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">Or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* --- GOOGLE BUTTON --- */}
                <Button
                  onClick={loginWithGoogle}
                  variant="outlined"
                  fullWidth
                  sx={{
                    height: "56px",
                    borderColor: "#e5e7eb",
                    color: "#374151",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 500,
                    textTransform: "none",
                    display: "flex",
                    gap: "12px",
                    "&:hover": { backgroundColor: "#f9fafb", borderColor: "#d1d5db" },
                  }}
                >
                  <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google" 
                    className="w-5 h-5" 
                  />
                  <span>
                  Continue with Google {' '}
                  <span className="font-normal text-gray-400 text-sm">
                      (Only for Company)
                  </span>
                  </span>
                </Button>

            <Typography
              sx={{
                fontSize: "12px",
                color: "#9ca3af",
                textAlign: "center",
                lineHeight: 1.5,
                fontFamily: "Inter, sans-serif",
              }}
            >
              By authenticating, you agree to the LuppoGrove Terms of Service.
            </Typography>
          </Stack>
        </Paper>
      </motion.div>
    </Box>
  );
}