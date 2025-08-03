import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
}

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export function GoogleSignInButton({ onSuccess }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    initializeGoogleSignIn();
  }, []);

  const initializeGoogleSignIn = () => {
    setError(null);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    console.log("Initializing Google Sign-In...");
    console.log("Client ID:", clientId ? "Set" : "Not set");
    console.log("Current origin:", window.location.origin);

    if (!clientId) {
      setError(
        "Google Client ID not found. Please set VITE_GOOGLE_CLIENT_ID in your .env.local file"
      );
      setLoading(false);
      return;
    }

    // Check if script already exists
    if (
      document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      )
    ) {
      if (window.google?.accounts?.id) {
        initializeGoogleAfterLoad();
      } else {
        setTimeout(initializeGoogleAfterLoad, 1000);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Google Sign-In script loaded");
      // Wait a bit for the script to fully initialize
      setTimeout(initializeGoogleAfterLoad, 100);
    };
    script.onerror = () => {
      console.error("Failed to load Google Sign-In script");
      setError("Failed to load Google Sign-In");
      setLoading(false);
    };
    document.head.appendChild(script);
  };

  const initializeGoogleAfterLoad = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    try {
      if (!window.google?.accounts?.id) {
        console.error("Google accounts API not available");
        setError("Google Sign-In not available");
        setLoading(false);
        return;
      }

      console.log("Initializing Google accounts...");
      console.log("Using Client ID:", clientId);

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false, // Disable FedCM to avoid CORS issues
        ux_mode: "popup", // Force popup mode
        context: "signin", // Set context
        itp_support: true, // Enable ITP support
      });

      // Render the button immediately after initialization
      const buttonElement = document.getElementById("google-signin-button");
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "signin_with",
          width: "100%",
        });
        console.log("Google button rendered in initialization");
      }

      setGoogleReady(true);
      setLoading(false);
      console.log("Google Sign-In initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Google Sign-In:", error);
      setError("Failed to initialize Google Sign-In");
      setLoading(false);
    }
  };

  const handleCredentialResponse = async (response: any) => {
    console.log("Received credential response");
    setLoading(true);
    setError(null);

    try {
      const success = await loginWithGoogle(response.credential);
      if (success) {
        onSuccess?.();
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!googleReady || loading ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={true}
        >
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {googleReady ? "Signing in..." : "Loading Google Sign-In..."}
          </span>
        </Button>
      ) : (
        <div id="google-signin-button" className="w-full flex justify-center" />
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-2 text-xs text-gray-500">
          <p>
            Client ID:{" "}
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? "✓ Set" : "✗ Not set"}
          </p>
          <p>Google Ready: {googleReady ? "✓ Yes" : "✗ No"}</p>
        </div>
      )}
    </div>
  );
}
