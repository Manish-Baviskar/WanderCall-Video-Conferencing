import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, CircularProgress, Divider } from '@mui/material';


const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Authentication() {
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
    const backendUrl = window.location.hostname === "localhost" 
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
        await handleRegister(name, username, password);
        setUsername("");
        setPassword("");
        setName("");
        setFormState(0);
        setMessage("Registration Successful! Please login.");
        setOpen(true);
      }
    } catch (err) {
      let msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
    }
    finally {
      // 2. Stop Loading (This runs even if there is an error)
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      
      
      <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        
        
        <Box
          sx={{
            flex: 0.7, // 70% width
            display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on desktop
            backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 4, 
          }}
        >
          
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '15px 25px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              maxWidth: 'fit-content',
              mb: 4,
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffa500' }}>
              WanderCall
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4
            }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
            <Avatar sx={{ m: 1, bgcolor: '#ffa500' }}>
              <LockOutlinedIcon />
            </Avatar>
            
            <Typography component="h1" variant="h5">
              {formState === 0 ? "Sign In" : "Sign Up"}
            </Typography>

            <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                sx={{
                  mt: 2,
                  mb: 2,
                  borderColor: '#4285F4',
                  color: 'white', 
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: '#4285F4',
                    backgroundColor: 'rgba(66, 133, 244, 0.1)'
                  }
                }}
              >
                Sign in with Google
              </Button>

              <Divider sx={{ my: 2, color: 'gray' }}>OR</Divider>
              
              {formState === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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
                sx={{ mt: 3, mb: 2, bgcolor: '#ffa500', color: 'black', fontWeight: 'bold' }}
                onClick={handleAuth}
              >
                {isLoading ? (
                    // Show Spinner
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    // Show Text
                    formState === 0 ? "Login" : "Register"
                )}
              </Button>

              <Button 
                fullWidth 
                sx={{ color: '#ffa500' }} 
                onClick={() => { setFormState(formState === 0 ? 1 : 0); setError(""); }}
              >
                {formState === 0 ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
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