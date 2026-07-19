import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Assessment,
  AssignmentInd,
  DashboardCustomize,
  History,
  ManageAccounts,
  NotificationsActive,
  Person,
  ReceiptLong,
  Settings,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import api from "../api/axiosConfig";

const drawerWidth = 260;

const sidebarItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardCustomize />,
    roles: ["ADMIN", "FRAUD_ANALYST", "VIEWER"],
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: <ReceiptLong />,
    roles: ["ADMIN", "FRAUD_ANALYST"],
  },
  {
    label: "Fraud Alerts",
    path: "/fraud-alerts",
    icon: <NotificationsActive />,
    roles: ["ADMIN", "FRAUD_ANALYST"],
  },
  {
  label: "Analyst Workload",
  path: "/analyst-workload",
  icon: <ManageAccounts />,
  roles: ["ADMIN"],
},
  {
  label: "My Cases",
  path: "/my-cases",
  icon: <AssignmentInd />,
  roles: ["FRAUD_ANALYST"],
},
  {
    label: "Reports",
    path: "/reports",
    icon: <Assessment />,
    roles: ["ADMIN", "FRAUD_ANALYST", "VIEWER"],
  },
  {
    label: "Audit Logs",
    path: "/audit-logs",
    icon: <History />,
    roles: ["ADMIN"],
  },
  {
    label: "User Management",
    path: "/users",
    icon: <ManageAccounts />,
    roles: ["ADMIN"],
  },
  {
  label: "Profile",
  path: "/profile",
  icon: <Person />,
  roles: ["ADMIN", "FRAUD_ANALYST", "VIEWER"],
},
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings />,
    roles: ["ADMIN"],
  },
];

function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem("fraudguard_role");

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #e2e8f0",
          backgroundColor: "#0f172a",
          color: "#ffffff",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          FraudGuard AI
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
          Banking Fraud Detection
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

      <List sx={{ px: 2, py: 2 }}>
        {sidebarItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive ? "#2563eb" : "transparent",
                    color: isActive ? "#ffffff" : "#cbd5e1",
                    textDecoration: "none",
                    "&:hover": {
                      backgroundColor: isActive ? "#2563eb" : "#1e293b",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#ffffff" : "#94a3b8",
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </Drawer>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadProfile() {
    try {
      const response = await api.get("/profile/me");
      setProfile(response.data);
      setFullName(response.data.fullName);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load profile.");
    }
  }

  async function updateProfile(event) {
    event.preventDefault();

    try {
      const response = await api.put("/profile/me", { fullName });

      setProfile(response.data);
      localStorage.setItem("fraudguard_fullName", response.data.fullName);
      setSuccessMessage("Profile updated successfully.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await api.put("/profile/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setSuccessMessage(
        response.data?.message || "Password changed successfully."
      );
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      setError(message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: "100vh",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Profile
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Manage your account details and password
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={localStorage.getItem("fraudguard_role") || "USER"}
                color="primary"
                variant="outlined"
              />

              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  localStorage.removeItem("fraudguard_token");
                  localStorage.removeItem("fraudguard_fullName");
                  localStorage.removeItem("fraudguard_email");
                  localStorage.removeItem("fraudguard_role");
                  window.location.href = "/login";
                }}
              >
                Logout
              </Button>

              <Avatar sx={{ bgcolor: "#2563eb" }}>
                {(localStorage.getItem("fraudguard_fullName") || "U").charAt(0)}
              </Avatar>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold">
              My Profile
            </Typography>
            <Typography color="text.secondary" mt={1}>
              View your account information and update your login security.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Account Information
                </Typography>

                <Stack spacing={2}>
                  <Typography>
                    <strong>Email:</strong> {profile?.email || "Loading..."}
                  </Typography>
                  <Typography>
                    <strong>Role:</strong> {profile?.role || "Loading..."}
                  </Typography>
                  <Typography>
                    <strong>Created At:</strong>{" "}
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleString()
                      : "Loading..."}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Update Profile
                </Typography>

                <Box component="form" onSubmit={updateProfile}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    sx={{ mb: 2 }}
                    required
                  />

                  <Button type="submit" variant="contained">
                    Save Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Change Password
                </Typography>

                <Typography color="text.secondary" mt={0.5} mb={2}>
                  Enter your current password, then choose a new password.
                  Use the eye icons to show or hide each password.
                </Typography>

                <Box component="form" onSubmit={changePassword}>
                  <TextField
                    label="Current Password"
                    type={showCurrentPassword ? "text" : "password"}
                    fullWidth
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    sx={{ mb: 2 }}
                    required
                    autoComplete="current-password"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              edge="end"
                              onClick={() =>
                                setShowCurrentPassword((visible) => !visible)
                              }
                              onMouseDown={(event) => event.preventDefault()}
                              aria-label={
                                showCurrentPassword
                                  ? "Hide current password"
                                  : "Show current password"
                              }
                            >
                              {showCurrentPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    fullWidth
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    sx={{ mb: 2 }}
                    required
                    autoComplete="new-password"
                    helperText="Minimum 8 characters and different from your current password"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              edge="end"
                              onClick={() =>
                                setShowNewPassword((visible) => !visible)
                              }
                              onMouseDown={(event) => event.preventDefault()}
                              aria-label={
                                showNewPassword
                                  ? "Hide new password"
                                  : "Show new password"
                              }
                            >
                              {showNewPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    sx={{ mb: 2 }}
                    required
                    autoComplete="new-password"
                    error={
                      confirmPassword.length > 0 &&
                      confirmPassword !== newPassword
                    }
                    helperText={
                      confirmPassword.length > 0 &&
                      confirmPassword !== newPassword
                        ? "Passwords do not match"
                        : "Enter the new password again"
                    }
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              edge="end"
                              onClick={() =>
                                setShowConfirmPassword((visible) => !visible)
                              }
                              onMouseDown={(event) => event.preventDefault()}
                              aria-label={
                                showConfirmPassword
                                  ? "Hide confirmation password"
                                  : "Show confirmation password"
                              }
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    disabled={changingPassword}
                    startIcon={
                      changingPassword ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : null
                    }
                  >
                    {changingPassword
                      ? "Changing Password..."
                      : "Change Password"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Stack>

          <Snackbar
            open={Boolean(successMessage)}
            autoHideDuration={4000}
            onClose={() => setSuccessMessage("")}
          >
            <Alert
              severity="success"
              variant="filled"
              onClose={() => setSuccessMessage("")}
            >
              {successMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
}