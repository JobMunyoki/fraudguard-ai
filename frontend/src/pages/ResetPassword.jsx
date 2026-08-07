import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] =
    useState("");
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "This password reset link is invalid."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirmation password do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/reset-password",
        {
          token,
          newPassword,
          confirmPassword,
        }
      );

      setSuccess(
        response.data?.message ||
          "Password reset successfully."
      );

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(
        "Password reset failed:",
        err
      );

      const backendMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.response?.data?.error;

      setError(
        backendMessage ||
          "The reset link is invalid, expired, or has already been used."
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
              Reset Password
            </Typography>

            <Typography
              color="text.secondary"
              textAlign="center"
              mt={1}
              mb={4}
            >
              Create a new password for your
              FraudGuard AI account.
            </Typography>

            {!token && (
              <Alert severity="error" sx={{ mb: 3 }}>
                This password reset link is invalid
                or incomplete. Request a new link.
              </Alert>
            )}

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

            {!success && (
              <Box
                component="form"
                onSubmit={handleSubmit}
              >
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  helperText="Use at least 8 characters."
                  sx={{ mb: 3 }}
                  disabled={!token}
                  required
                />

                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  sx={{ mb: 3 }}
                  disabled={!token}
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading || !token}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "RESET PASSWORD"
                  )}
                </Button>
              </Box>
            )}

            {success && (
              <Button
                type="button"
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate("/login")}
              >
                GO TO LOGIN
              </Button>
            )}

            {!success && (
              <Button
                type="button"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() =>
                  navigate("/forgot-password")
                }
              >
                REQUEST A NEW RESET LINK
              </Button>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}