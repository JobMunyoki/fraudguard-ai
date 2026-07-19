import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import api from "../api/axiosConfig";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@fraudguard.ai");
  const [password, setPassword] = useState("admin123");
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
                type="password"
                fullWidth
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                sx={{ mb: 3 }}
                required
              />

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