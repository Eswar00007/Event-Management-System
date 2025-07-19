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
  FormControlLabel,
  Checkbox,
  Grid,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Email,
  PersonAdd,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    success: {
      main: "#2e7d32",
    },
  },
});

const Signup = ({ setToken }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 30) return "error";
    if (strength < 60) return "warning";
    if (strength < 80) return "info";
    return "success";
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  };

  const validateFirstName = (value) => {
    if (!value.trim()) return "First name is required";
    if (value.length < 2) return "First name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(value))
      return "First name can only contain letters";
    return "";
  };

  const validateLastName = (value) => {
    if (!value.trim()) return "Last name is required";
    if (value.length < 2) return "Last name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(value))
      return "Last name can only contain letters";
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validateUsername = (value) => {
    if (!value.trim()) return "Username is required";
    if (value.length < 3) return "Username must be at least 3 characters";
    if (value.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(value))
      return "Username can only contain letters, numbers, and underscores";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(value))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(value))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*[0-9])/.test(value))
      return "Password must contain at least one number";
    return "";
  };

  const validateConfirmPassword = (value, password) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return "";
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    let error = "";
    switch (field) {
      case "firstName":
        error = validateFirstName(value);
        break;
      case "lastName":
        error = validateLastName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "username":
        error = validateUsername(value);
        break;
      case "password":
        error = validatePassword(value);
        setPasswordStrength(calculatePasswordStrength(value));
        if (formData.confirmPassword) {
          const confirmError = validateConfirmPassword(
            formData.confirmPassword,
            value
          );
          setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value, formData.password);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));

    if (signupError) setSignupError("");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");

    const newErrors = {
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      email: validateEmail(formData.email),
      username: validateUsername(formData.username),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      ),
    };

    if (!acceptTerms) {
      setSignupError("Please accept the Terms and Conditions to continue");
      return;
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim(),
        password: formData.password,
      });

      if (response.data.token) {
        setToken(response.data.token);
        navigate("/home");
      } else {
        navigate("/login", {
          state: {
            message: "Account created successfully! Please sign in.",
          },
        });
      }
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response?.status === 409) {
        const conflictField = error.response.data.field;
        if (conflictField === "email") {
          setSignupError("An account with this email already exists");
          setErrors((prev) => ({ ...prev, email: " " }));
        } else if (conflictField === "username") {
          setSignupError("This username is already taken");
          setErrors((prev) => ({ ...prev, username: " " }));
        } else {
          setSignupError("An account with these credentials already exists");
        }
      } else if (error.response?.status === 429) {
        setSignupError("Too many signup attempts. Please try again later.");
      } else if (error.code === "ECONNREFUSED" || !error.response) {
        setSignupError("Unable to connect to server. Please try again later.");
      } else {
        setSignupError("An unexpected error occurred. Please try again.");
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
              maxWidth: 500,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
              }}
            >
              <PersonAdd sx={{ mr: 1, fontSize: 32, color: "primary.main" }} />
              <Typography component="h1" variant="h4" fontWeight="bold">
                Sign Up
              </Typography>
            </Box>

            {signupError && (
              <Alert
                severity="error"
                sx={{ width: "100%", mb: 2 }}
                onClose={() => setSignupError("")}
              >
                {signupError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formData.firstName}
                    onChange={handleInputChange("firstName")}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person
                            color={errors.firstName ? "error" : "action"}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleInputChange("lastName")}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person
                            color={errors.lastName ? "error" : "action"}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color={errors.email ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleInputChange("username")}
                error={!!errors.username}
                helperText={
                  errors.username ||
                  "Choose a unique username (3-20 characters)"
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color={errors.username ? "error" : "action"} />
                    </InputAdornment>
                  ),
                  endAdornment:
                    formData.username && !errors.username ? (
                      <InputAdornment position="end">
                        <CheckCircle color="success" />
                      </InputAdornment>
                    ) : null,
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange("password")}
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
              />

              {formData.password && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                      Password strength:
                    </Typography>
                    <Typography
                      variant="body2"
                      color={`${getPasswordStrengthColor(
                        passwordStrength
                      )}.main`}
                      fontWeight="bold"
                    >
                      {getPasswordStrengthText(passwordStrength)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    color={getPasswordStrengthColor(passwordStrength)}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock
                        color={errors.confirmPassword ? "error" : "action"}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {formData.confirmPassword && !errors.confirmPassword ? (
                        <CheckCircle color="success" />
                      ) : formData.confirmPassword && errors.confirmPassword ? (
                        <Cancel color="error" />
                      ) : (
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{" "}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Terms clicked");
                      }}
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Privacy Policy clicked");
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{ mt: 2, mb: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !acceptTerms}
                sx={{
                  mt: 2,
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
                    <span style={{ opacity: 0.7 }}>Creating Account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <Divider sx={{ my: 2 }}>or</Divider>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                  >
                    Sign In
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

export default Signup;
