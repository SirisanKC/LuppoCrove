import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner"; // 🟢 Import the Toaster

// LuppoGrove - University-Industry Collaboration Platform
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      {/* 🟢 Add the Toaster here so it sits on top of all your pages */}
      <Toaster position="top-center" richColors /> 
    </AuthProvider>
  );
}