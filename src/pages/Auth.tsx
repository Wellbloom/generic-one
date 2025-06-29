import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // If still loading, show nothing (to prevent flash of login modal)
  if (loading) {
    return null;
  }

  // If not authenticated, show login modal
  return (
    <LoginModal
      isOpen={showLogin}
      onClose={() => {
        setShowLogin(false);
        navigate("/");
      }}
    />
  );
};

export default Auth;
