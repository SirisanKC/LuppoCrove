import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "motion/react";
import { toast } from "sonner";

export function UpdatePassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsUpdating(true);
    try {
      await updatePassword(password);
      toast.success("Password updated successfully!");
      
      // Send them to the login page so they can log in with the new password
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to update password.");
      setIsUpdating(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", backgroundColor: "#fafaf9", px: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "480px", maxWidth: "calc(100vw - 48px)", backgroundColor: "#ffffff",
            borderRadius: "16px", padding: "48px", boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
          }}
        >
          <Stack sx={{ gap: "32px" }}>
            <Typography sx={{ fontSize: "24px", fontWeight: 700, color: "#2d5a47", fontFamily: "Inter, sans-serif" }}>
              LuppoGrove
            </Typography>

            <Stack sx={{ gap: "8px" }}>
              <Typography sx={{ fontSize: "28px", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.3 }}>
                Set New Password
              </Typography>
              <Typography sx={{ fontSize: "16px", color: "#6b6b6b" }}>
                Please create a strong, secure password for your account.
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700 font-medium">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a47]/50 transition-all pr-12"
                    placeholder="Enter new password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700 font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a47]/50 transition-all pr-12"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isUpdating}
                disableRipple fullWidth
                sx={{
                  mt: 2, height: "56px", backgroundColor: "#2d5a47", color: "#ffffff",
                  borderRadius: "12px", fontSize: "16px", fontWeight: 500, textTransform: "none",
                  "&:hover": { backgroundColor: "#1e3d30" }, "&:disabled": { opacity: 0.7 },
                }}
              >
                <CheckCircle2 size={20} className="mr-2" />
                {isUpdating ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Stack>
        </Paper>
      </motion.div>
    </Box>
  );
}