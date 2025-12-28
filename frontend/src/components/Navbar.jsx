import React, { useCallback, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useAuth, useClerk, SignedOut } from "@clerk/clerk-react";
import { navbarStyles } from "../assets/dummyStyles";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const clerk = useClerk();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [open,setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const TOKEN_KEY = "token";
  const fetchAndStoreToken = useCallback(
  async (options) => {
    if (!getToken) return null;
    try {
      const token = await getToken(options);
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
      return token;
    } catch {
      return null;
    }
  },
  [getToken]
);


useEffect(() => {
  let mounted = true;

  (async () => {
    if (isSignedIn) {
      const t = await fetchAndStoreToken({ template: "default" });
      if (!t && mounted) {
        await fetchAndStoreToken({ forceRefresh: true });
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  })();

  return () => {
    mounted = false;
  };
}, [isSignedIn, fetchAndStoreToken, user]);

useEffect(() => {
  if (!isSignedIn) return;

  const pathname = window.location.pathname || "/";
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/auth") ||
    pathname === "/"
  ) {
    navigate("/app/dashboard", { replace: true });
  }
}, [isSignedIn, navigate]);

useEffect(() => {
  function onDocClick(e) {
    if (!profileRef.current) return;
    if (!profileRef.current.contains(e.target)) {
      setProfileOpen(false);
    }
  }
  if (profileOpen) {
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
  }
  return () => {
    document.removeEventListener("mousedown", onDocClick);
    document.removeEventListener("touchstart", onDocClick);
  };
}, [profileOpen]);
  function openSignIn() {
  try {
    if (clerk && typeof clerk.openSignIn === "function") {
      clerk.openSignIn();
    } else {
      navigate("/login");
    }
  } catch (err) {
    console.error("openSignIn failed:", err);
    navigate("/login");
  }
}

function openSignUp() {
  try {
    if (clerk && typeof clerk.openSignUp === "function") {
      clerk.openSignUp();
    } else {
      navigate("/signup");
    }
  } catch (err) {
    console.error("openSignUp failed:", err);
    navigate("/signup");
  }
}



  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        <nav className={navbarStyles.nav}>
          <div className={navbarStyles.logoSection}>
            <Link to="/" className={navbarStyles.logoLink}>
              <img
                src={logo}
                alt="Invoice Flow logo"
                className={navbarStyles.logoImage}
              />
              <span className={navbarStyles.logoText}>Invoice Flow</span>
            </Link>

            <div className={navbarStyles.desktopNav}>
              <a href="#features" className={navbarStyles.navLink}>
                Features
              </a>
              <a href="#pricing" className={navbarStyles.navLinkInactive}>
                Pricing
              </a>
            </div>
          </div>

          <div className={navbarStyles.authSection}>
            <SignedOut>
              <button
                onClick={openSignIn}
                className={navbarStyles.signInButton}
                type="button"
              >
                Sign In
              </button>
              <button onClick={openSignUp} className={navbarStyles.signUpButton} type="button">
                    <div className={navbarStyles.signUpOverlay}></div>
                    <span className={navbarStyles.signUpText}>
                        Get Started
                    </span>
                    <svg
                        className={navbarStyles.signUpIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        >
                        <path d="M5 12h14m-7-7l7 7-7 7" />
                    </svg>
              </button>
            </SignedOut>
          </div>
            <button onClick={() => setOpen(!open)} className={navbarStyles.mobileMenu}>
                <div className={navbarStyles.mobileMenuIcon} >
                    <span className={`${navbarStyles.mobileMenuLine1} ${
                        open ? navbarStyles.mobileMenuLine1Open : navbarStyles.mobileMenuLine1Closed
                    }`}></span>
                    <span className={`${navbarStyles.mobileMenuLine2} ${
                        open ? navbarStyles.mobileMenuLine2Open : navbarStyles.mobileMenuLine2Closed
                    }`}></span>
                    <span className={`${navbarStyles.mobileMenuLine3} ${
                        open ? navbarStyles.mobileMenuLine3Open : navbarStyles.mobileMenuLine3Closed
                    }`}></span>
                </div>
            </button>
        </nav>
        <div className={`md:hidden ${
    open ? "block" : "hidden"
  } ${navbarStyles.mobileAuthSection}`} >
            <div className={navbarStyles.mobileMenuContainer} >
                <a href="#features" onClick={() => setOpen(false)} className={navbarStyles.mobileNavLink}>
  Features
</a>
                <a href="#pricing" onClick={() => setOpen(false)} className={navbarStyles.mobileNavLink}>
  Pricing
</a>

                <div className={navbarStyles.mobileAuthSection}>
                    <SignedOut>
                        <button onClick={openSignIn} className={navbarStyles.mobileSignIn}>Sign In</button>

                        <button onClick={openSignUp} className={navbarStyles.mobileSignUp}>Get Started</button>
                    </SignedOut>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
