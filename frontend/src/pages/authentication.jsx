import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import { Snackbar, CircularProgress, Divider } from "@mui/material";

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const GoogleLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function Authentication() {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleGoogleLogin = () => {
    // Dynamically choose backend URL based on where frontend is running
    const backendUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://wandercallbackend.onrender.com"; // Your LIVE Backend URL

    // Redirect browser to the backend trigger route
    window.location.href = `${backendUrl}/api/v1/users/auth/google`;
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else {
        await handleRegister(name, username, password, email);
        setUsername("");
        setPassword("");
        setName("");
        setEmail("");
        setFormState(0);
        setMessage("Registration Successful! Please login.");
        setOpen(true);
      }
    } catch (err) {
      let msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
    } finally {
      // 2. Stop Loading (This runs even if there is an error)
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 0.7, // 70% width
            display: { xs: "none", md: "flex" }, // Hide on mobile, show on desktop
            backgroundImage:
              "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) => t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: 4,
          }}
        >
          <Box
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "15px 25px",
              borderRadius: "15px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              maxWidth: "fit-content",
              mb: 4,
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#ffa500" }}
            >
              WanderCall
            </Typography>
            <Typography variant="body2" sx={{ color: "white", opacity: 0.9 }}>
              Designed & Developed by <b>Manish Baviskar</b>
            </Typography>
          </Box>
        </Box>

        <Box
          component={Paper}
          elevation={6}
          square
          sx={{
            flex: { xs: 1, md: 0.3 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "#ffa500" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              {formState === 0 ? "Sign In" : "Sign Up"}
            </Typography>

            <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
              <Button
                fullWidth
                variant="contained" // Changing to 'contained' for the white background
                startIcon={<GoogleLogo />} // Use the colorful icon
                onClick={handleGoogleLogin}
                sx={{
                  mt: 2,
                  mb: 2,
                  backgroundColor: "white", // Official White Background
                  color: "#1f1f1f", // Official Dark Grey Text
                  textTransform: "none", // Prevents ALL CAPS
                  fontSize: "1rem",
                  fontWeight: 500, // Medium weight looks best
                  fontFamily: "Roboto, sans-serif",
                  boxShadow: "0 2px 4px 0 rgba(0,0,0,.25)", // Subtle Google shadow
                  border: "1px solid #dadce0", // Subtle border
                  "&:hover": {
                    backgroundColor: "#f8faff", // Very light blue on hover
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,.25)", // Lift effect on hover
                    borderColor: "#d2e3fc",
                  },
                }}
              >
                Sign in with Google
              </Button>

              <Divider sx={{ my: 2, color: "gray" }}>OR</Divider>

              {formState === 1 && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>

              <Button
                type="button"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: "#ffa500",
                  color: "black",
                  fontWeight: "bold",
                }}
                onClick={handleAuth}
              >
                {isLoading ? (
                  // Show Spinner
                  <CircularProgress size={24} color="inherit" />
                ) : // Show Text
                formState === 0 ? (
                  "Login"
                ) : (
                  "Register"
                )}
              </Button>

              <Button
                fullWidth
                sx={{ color: "#ffa500" }}
                onClick={() => {
                  setFormState(formState === 0 ? 1 : 0);
                  setError("");
                }}
              >
                {formState === 0
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </ThemeProvider>
  );
}
