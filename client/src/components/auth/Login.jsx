import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Container,
  Link,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Login as LoginIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom theme for better visual appeal
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  // Validation functions
  const validateUsername = (value) => {
    if (!value.trim()) {
      return "Username is required";
    }
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  // Handle input changes with validation
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    const error = validateUsername(value);
    setErrors((prev) => ({
      ...prev,
      username: error,
    }));

    // Clear login error when user starts typing
    if (loginError) setLoginError("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const error = validatePassword(value);
    setErrors((prev) => ({
      ...prev,
      password: error,
    }));

    // Clear login error when user starts typing
    if (loginError) setLoginError("");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    // Validate all fields
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    const newErrors = {
      username: usernameError,
      password: passwordError,
    };

    setErrors(newErrors);

    // If there are validation errors, don't submit
    if (usernameError || passwordError) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username: username.trim(),
        password,
      });

      setToken(response.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setLoginError("Invalid username or password");
        // Mark fields as having errors for visual feedback
        setErrors({
          username: " ", // Space to trigger error state without message
          password: " ",
        });
      } else if (error.response?.status === 429) {
        setLoginError("Too many login attempts. Please try again later.");
      } else if (error.code === "ECONNREFUSED" || !error.response) {
        setLoginError("Unable to connect to server. Please try again later.");
      } else {
        setLoginError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: 3,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: 400,
              borderRadius: 2,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
              }}
            >
              <LoginIcon sx={{ mr: 1, fontSize: 32, color: "primary.main" }} />
              <Typography component="h1" variant="h4" fontWeight="bold">
                Sign In
              </Typography>
            </Box>

            {/* Error Alert */}
            {loginError && (
              <Alert
                severity="error"
                sx={{ width: "100%", mb: 2 }}
                onClose={() => setLoginError("")}
              >
                {loginError}
              </Alert>
            )}

            {/* Login Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              {/* Username Field */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={handleUsernameChange}
                error={!!errors.username}
                helperText={errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color={errors.username ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: errors.username
                        ? "error.main"
                        : "primary.main",
                    },
                  },
                }}
              />

              {/* Password Field */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color={errors.password ? "error" : "action"} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: errors.password
                        ? "error.main"
                        : "primary.main",
                    },
                  },
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  position: "relative",
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{
                        position: "absolute",
                        left: "50%",
                        marginLeft: "-10px",
                      }}
                    />
                    <span style={{ opacity: 0.7 }}>Signing In...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <Divider sx={{ my: 2 }}>or</Divider>

              {/* Additional Links */}
              <Box sx={{ textAlign: "center" }}>
                <Link
                  href="#"
                  variant="body2"
                  sx={{ display: "block", mb: 1 }}
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle forgot password logic here
                    console.log("Forgot password clicked");
                  }}
                >
                  Forgot password?
                </Link>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle sign up navigation here
                      console.log("Sign up clicked");
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
