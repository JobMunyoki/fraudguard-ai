import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Divider,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import api from "../api/axiosConfig";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const DEMO_EMAIL = "analyst.demo@fraudguard.ai";
const DEMO_PASSWORD = "123456789";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const fillDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  const sessionMessage = sessionStorage.getItem(
    "fraudguard_auth_message"
  );

  if (sessionMessage) {
    setError(sessionMessage);

    sessionStorage.removeItem(
      "fraudguard_auth_message"
    );
  }
}, []);

  async function handleLogin(event) {
  event.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("fraudguard_token", response.data.token);
    localStorage.setItem(
      "fraudguard_fullName",
      response.data.fullName
    );
    localStorage.setItem(
      "fraudguard_email",
      response.data.email
    );
    localStorage.setItem(
      "fraudguard_role",
      response.data.role
    );

    navigate("/dashboard");
  } catch (err) {
    console.error("Login failed:", err);

    const backendMessage =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.response?.data?.error;

    if (err.response?.status === 403) {
      setError(
        backendMessage ||
          "This account has been disabled. Contact an administrator."
      );
    } else {
      setError(backendMessage || "Invalid email or password.");
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              FraudGuard AI
            </Typography>

            <Typography color="text.secondary" textAlign="center" mt={1} mb={4}>
              Sign in to access the fraud detection dashboard
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                sx={{ mb: 3 }}
                required
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                sx={{ mb: 1 }}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 2,
                }}
              >
                <Button
                  type="button"
                  size="small"
                  onClick={() =>
                    navigate("/forgot-password")
                  }
                >
                  Forgot password?
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }}>Demo Access</Divider>

            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "grey.50",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                Demo Analyst Account
              </Typography>

              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Email:</strong> {DEMO_EMAIL}
              </Typography>

              <Typography variant="body2">
                <strong>Password:</strong> {DEMO_PASSWORD}
              </Typography>

              <Button
                type="button"
                fullWidth
                variant="outlined"
                sx={{ mt: 1.5 }}
                onClick={fillDemoCredentials}
              >
                USE DEMO ACCOUNT
              </Button>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mt={3}
            >
              Role-based access control enabled
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}