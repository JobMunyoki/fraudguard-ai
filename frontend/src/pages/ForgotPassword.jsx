import { useState } from "react";
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

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/forgot-password",
        {
          email,
        }
      );

      setSuccess(
        response.data?.message ||
          "If an account exists for that email, a password reset link has been sent."
      );

      setEmail("");
    } catch (err) {
      console.error(
        "Forgot password request failed:",
        err
      );

      const backendMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.response?.data?.error;

      setError(
        backendMessage ||
          "Unable to process the password reset request. Please try again."
      );
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
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
            >
              Forgot Password
            </Typography>

            <Typography
              color="text.secondary"
              textAlign="center"
              mt={1}
              mb={4}
            >
              Enter your FraudGuard AI account email.
              We will send you a secure password reset link.
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
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
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "SEND RESET LINK"
                )}
              </Button>
            </Box>

            <Button
              type="button"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate("/login")}
            >
              BACK TO LOGIN
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mt={2}
            >
              For security, FraudGuard AI will not
              reveal whether an email address is
              registered.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}