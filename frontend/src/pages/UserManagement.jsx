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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  useMediaQuery,
  Typography,
} from "@mui/material";
import {
  Assessment,
  AssignmentInd,
  DashboardCustomize,
  History,
  LockReset,
  ManageAccounts,
  Menu,
  NotificationsActive,
  Person,
  PersonAdd,
  ReceiptLong,
  Settings,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import api from "../api/axiosConfig";

const drawerWidth = 260;

const initialUserForm = {
  fullName: "",
  email: "",
  password: "",
  role: "FRAUD_ANALYST",
};

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

function Sidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const role = localStorage.getItem("fraudguard_role");

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0f172a",
        color: "#ffffff",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          FraudGuard AI
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#94a3b8", mt: 0.5 }}
        >
          Banking Fraud Detection
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.12)",
        }}
      />

      <List sx={{ px: 2, py: 2 }}>
        {sidebarItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItem
                key={item.label}
                disablePadding
                sx={{ mb: 1 }}
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={onClose}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive
                      ? "#2563eb"
                      : "transparent",
                    color: isActive
                      ? "#ffffff"
                      : "#cbd5e1",

                    "&:hover": {
                      backgroundColor: isActive
                        ? "#2563eb"
                        : "#1e293b",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive
                        ? "#ffffff"
                        : "#94a3b8",
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

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <Card
          sx={{
            backgroundColor: "#1e293b",
            color: "#ffffff",
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography variant="body2" fontWeight="bold">
              System Status
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "#94a3b8" }}
            >
              Backend connected
            </Typography>

            <Box mt={1}>
              <Chip
                label="Online"
                size="small"
                sx={{
                  backgroundColor: "#16a34a",
                  color: "#ffffff",
                  fontWeight: "bold",
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #e2e8f0",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

export default function UserManagement() {
  const isMobile = useMediaQuery("(max-width:899px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState(initialUserForm);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [confirmTemporaryPassword, setConfirmTemporaryPassword] = useState("");
  const [showTemporaryPassword, setShowTemporaryPassword] = useState(false);
  const [showConfirmTemporaryPassword, setShowConfirmTemporaryPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  function handleMobileMenuOpen() {
    setMobileOpen(true);
  }

  function handleMobileMenuClose() {
    setMobileOpen(false);
  }

  async function loadUsers() {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load users. Only ADMIN can access this page.");
    }
  }

  async function updateUserRole(userId, role) {
    try {
      const response = await api.put(`/users/${userId}/role`, { role });

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId ? response.data : user
        )
      );

      setSuccessMessage("User role updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update user role.");
    }
  }


  function handleNewUserChange(event) {
    const { name, value } = event.target;
    setNewUser((previous) => ({ ...previous, [name]: value }));
  }

  function closeAddUserDialog() {
    if (creatingUser) return;
    setAddUserOpen(false);
    setNewUser(initialUserForm);
    setShowNewUserPassword(false);
  }

  async function createUser(event) {
    event.preventDefault();
    setError("");

    const fullName = newUser.fullName.trim();
    const email = newUser.email.trim().toLowerCase();

    if (!fullName || !email || !newUser.password || !newUser.role) {
      setError("Complete all user fields before saving.");
      return;
    }

    if (newUser.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setCreatingUser(true);

      const response = await api.post("/users", {
        fullName,
        email,
        password: newUser.password,
        role: newUser.role,
      });

      setUsers((previousUsers) => [...previousUsers, response.data]);
      setSuccessMessage(`User ${response.data.email} created successfully.`);
      setAddUserOpen(false);
      setNewUser(initialUserForm);
      setShowNewUserPassword(false);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      setError(message || "Failed to create user. Check that the email is unique.");
    } finally {
      setCreatingUser(false);
    }
  }

  function openStatusDialog(user) {
    setError("");
    setSelectedUser(user);
    setStatusDialogOpen(true);
  }

  function closeStatusDialog() {
    if (updatingStatus) return;
    setStatusDialogOpen(false);
    setSelectedUser(null);
  }

  async function updateUserStatus() {
    if (!selectedUser) return;

    const nextActive = selectedUser.active === false;

    try {
      setUpdatingStatus(true);
      setError("");

      const response = await api.put(`/users/${selectedUser.id}/status`, {
        active: nextActive,
      });

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === selectedUser.id ? response.data : user
        )
      );

      setSuccessMessage(
        `${response.data.email} ${
          response.data.active ? "reactivated" : "disabled"
        } successfully.`
      );

      setStatusDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      setError(message || "Failed to update the user account status.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  function openResetPasswordDialog(user) {
    setError("");
    setResetUser(user);
    setTemporaryPassword("");
    setConfirmTemporaryPassword("");
    setShowTemporaryPassword(false);
    setShowConfirmTemporaryPassword(false);
    setResetPasswordOpen(true);
  }

  function closeResetPasswordDialog() {
    if (resettingPassword) return;

    setResetPasswordOpen(false);
    setResetUser(null);
    setTemporaryPassword("");
    setConfirmTemporaryPassword("");
    setShowTemporaryPassword(false);
    setShowConfirmTemporaryPassword(false);
  }

  async function resetUserPassword(event) {
    event.preventDefault();
    setError("");

    if (!resetUser) return;

    if (temporaryPassword.length < 8) {
      setError("Temporary password must contain at least 8 characters.");
      return;
    }

    if (temporaryPassword !== confirmTemporaryPassword) {
      setError("Temporary password and confirmation password do not match.");
      return;
    }

    try {
      setResettingPassword(true);

      const response = await api.put(`/users/${resetUser.id}/password`, {
        newPassword: temporaryPassword,
        confirmPassword: confirmTemporaryPassword,
      });

      setSuccessMessage(
        response.data?.message ||
          `Password reset successfully for ${resetUser.email}.`
      );

      setResetPasswordOpen(false);
      setResetUser(null);
      setTemporaryPassword("");
      setConfirmTemporaryPassword("");
      setShowTemporaryPassword(false);
      setShowConfirmTemporaryPassword(false);
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      setError(message || "Failed to reset the user's password.");
    } finally {
      setResettingPassword(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleMobileMenuClose}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,

          width: {
            xs: "100%",
            md: `calc(100% - ${drawerWidth}px)`,
          },

          minWidth: 0,
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0,
              }}
            >
              <IconButton
                onClick={handleMobileMenuOpen}
                sx={{
                  display: {
                    xs: "inline-flex",
                    md: "none",
                  },
                }}
              >
                <Menu />
              </IconButton>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  noWrap
                >
                  User Management
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                  }}
                >
                  Manage FraudGuard AI users and access roles
                </Typography>
              </Box>
            </Box>

            <Stack
              direction="row"
              spacing={{ xs: 0.5, sm: 2 }}
              alignItems="center"
            >
              <Chip
                label={localStorage.getItem("fraudguard_role") || "USER"}
                color="primary"
                variant="outlined"
                sx={{
                  display: {
                    xs: "none",
                    sm: "inline-flex",
                  },
                }}
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

              <Avatar
                sx={{
                  bgcolor: "#2563eb",
                  display: {
                    xs: "none",
                    sm: "flex",
                  },
                }}
              >
                {(localStorage.getItem("fraudguard_fullName") || "U").charAt(0)}
              </Avatar>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth="xl"
          sx={{
            py: {
              xs: 3,
              md: 4,
            },
            px: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <Box
            mb={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            flexWrap="wrap"
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  fontSize: {
                    xs: "1.8rem",
                    sm: "2.125rem",
                  },
                  lineHeight: 1.2,
                }}
              >
                System Users
              </Typography>
              <Typography color="text.secondary" mt={1}>
                View users, create accounts, and update access levels.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
              onClick={() => {
                setError("");
                setAddUserOpen(true);
              }}
            >
              Add User
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Registered Users
              </Typography>

              {users.length === 0 ? (
  <Typography color="text.secondary">
    No users found.
  </Typography>
) : (
  <>
    {/* DESKTOP TABLE */}
    <Box
      sx={{
        overflowX: "auto",
        display: {
          xs: "none",
          md: "block",
        },
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        {/* Keep your existing thead and tbody here */}
      </table>
    </Box>

    {/* MOBILE USER CARDS */}
    <Stack
      spacing={2}
      sx={{
        display: {
          xs: "flex",
          md: "none",
        },
      }}
    >
      {users.map((user) => {
        const isCurrentUser =
          user.email === localStorage.getItem(
            "fraudguard_email"
          );

        const isActive = user.active !== false;

        return (
          <Card
            key={user.id}
            variant="outlined"
            sx={{
              borderRadius: 3,
              opacity: isActive ? 1 : 0.65,
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Full Name
                  </Typography>

                  <Typography fontWeight="bold">
                    {user.fullName}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Email
                  </Typography>

                  <Typography
                    sx={{
                      overflowWrap: "anywhere",
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Chip
                    label={user.role}
                    color={
                      user.role === "ADMIN"
                        ? "primary"
                        : "default"
                    }
                    variant="outlined"
                    size="small"
                  />

                  <Chip
                    label={
                      isActive ? "ACTIVE" : "DISABLED"
                    }
                    color={
                      isActive ? "success" : "error"
                    }
                    size="small"
                    variant={
                      isActive ? "filled" : "outlined"
                    }
                  />
                </Stack>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Created At
                  </Typography>

                  <Typography>
                    {formatDate(user.createdAt)}
                  </Typography>
                </Box>

                <Divider />

                <FormControl fullWidth>
                  <InputLabel>Change Role</InputLabel>

                  <Select
                    label="Change Role"
                    value={user.role}
                    onChange={(event) =>
                      updateUserRole(
                        user.id,
                        event.target.value
                      )
                    }
                    disabled={
                      isCurrentUser || !isActive
                    }
                  >
                    <MenuItem value="ADMIN">
                      ADMIN
                    </MenuItem>

                    <MenuItem value="FRAUD_ANALYST">
                      FRAUD_ANALYST
                    </MenuItem>

                    <MenuItem value="VIEWER">
                      VIEWER
                    </MenuItem>
                  </Select>
                </FormControl>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LockReset />}
                  disabled={isCurrentUser}
                  onClick={() =>
                    openResetPasswordDialog(user)
                  }
                >
                  Reset Password
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color={
                    isActive ? "error" : "success"
                  }
                  disabled={isCurrentUser}
                  onClick={() =>
                    openStatusDialog(user)
                  }
                >
                  {isActive
                    ? "Disable"
                    : "Reactivate"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  </>
)}
           </CardContent>
          </Card>

          <Dialog
            open={addUserOpen}
            onClose={closeAddUserDialog}
            fullWidth
            maxWidth="sm"
            fullScreen={isMobile}
          >
            <Box component="form" onSubmit={createUser}>
              <DialogTitle>Add FraudGuard User</DialogTitle>

              <DialogContent dividers>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                  <TextField
                    required
                    autoFocus
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={newUser.fullName}
                    onChange={handleNewUserChange}
                    disabled={creatingUser}
                  />

                  <TextField
                    required
                    fullWidth
                    type="email"
                    label="Email Address"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    disabled={creatingUser}
                  />

                  <TextField
                    required
                    fullWidth
                    type={showNewUserPassword ? "text" : "password"}
                    label="Temporary Password"
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    helperText="Use at least 8 characters."
                    disabled={creatingUser}
                    inputProps={{ minLength: 8 }}
                    autoComplete="new-password"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              edge="end"
                              disabled={creatingUser}
                              onClick={() =>
                                setShowNewUserPassword((visible) => !visible)
                              }
                              onMouseDown={(event) => event.preventDefault()}
                              aria-label={
                                showNewUserPassword
                                  ? "Hide temporary password"
                                  : "Show temporary password"
                              }
                            >
                              {showNewUserPassword ? (
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

                  <FormControl fullWidth required disabled={creatingUser}>
                    <InputLabel id="new-user-role-label">Role</InputLabel>
                    <Select
                      labelId="new-user-role-label"
                      label="Role"
                      name="role"
                      value={newUser.role}
                      onChange={handleNewUserChange}
                    >
                      <MenuItem value="ADMIN">ADMIN</MenuItem>
                      <MenuItem value="FRAUD_ANALYST">FRAUD_ANALYST</MenuItem>
                      <MenuItem value="VIEWER">VIEWER</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </DialogContent>

              <DialogActions
  sx={{
    px: {
      xs: 2,
      sm: 3,
    },
    py: 2,
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    alignItems: {
      xs: "stretch",
      sm: "center",
    },
    gap: 1,

    "& .MuiButton-root": {
      margin: 0,
      width: {
        xs: "100%",
        sm: "auto",
      },
    },
  }}
>
                <Button onClick={closeAddUserDialog} disabled={creatingUser}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={creatingUser}
                  startIcon={creatingUser ? <CircularProgress size={18} /> : <PersonAdd />}
                >
                  {creatingUser ? "Creating..." : "Create User"}
                </Button>
              </DialogActions>
            </Box>
          </Dialog>

          <Dialog
            open={resetPasswordOpen}
            onClose={closeResetPasswordDialog}
            fullWidth
            maxWidth="sm"
            fullScreen={isMobile}
          >
            <Box component="form" onSubmit={resetUserPassword}>
              <DialogTitle>Reset User Password</DialogTitle>

              <DialogContent dividers>
                <DialogContentText sx={{ mb: 2 }}>
                  Set a new temporary password for{" "}
                  <strong>{resetUser?.email}</strong>. The password is encrypted
                  before it is stored.
                </DialogContentText>

                <Stack spacing={2.5}>
                  <TextField
                    required
                    autoFocus
                    fullWidth
                    label="New Temporary Password"
                    type={showTemporaryPassword ? "text" : "password"}
                    value={temporaryPassword}
                    onChange={(event) =>
                      setTemporaryPassword(event.target.value)
                    }
                    disabled={resettingPassword}
                    autoComplete="new-password"
                    helperText="Minimum 8 characters"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              edge="end"
                              disabled={resettingPassword}
                              onClick={() =>
                                setShowTemporaryPassword((visible) => !visible)
                              }
                              onMouseDown={(event) => event.preventDefault()}
                              aria-label={
                                showTemporaryPassword
                                  ? "Hide temporary password"
                                  : "Show temporary password"
                              }
                            >
                              {showTemporaryPassword ? (
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
                    required
                    fullWidth
                    label="Confirm Temporary Password"
                    type={
                      showConfirmTemporaryPassword ? "text" : "password"
                    }
                    value={confirmTemporaryPassword}
                    onChange={(event) =>
                      setConfirmTemporaryPassword(event.target.value)
                    }
                    disabled={resettingPassword}
                    autoComplete="new-password"
                    error={
                      confirmTemporaryPassword.length > 0 &&
                      confirmTemporaryPassword !== temporaryPassword
                    }
                    helperText={
                      confirmTemporaryPassword.length > 0 &&
                      confirmTemporaryPassword !== temporaryPassword
                        ? "Passwords do not match"
                        : "Enter the temporary password again"
                    }
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              edge="end"
                              disabled={resettingPassword}
                              onClick={() =>
                                setShowConfirmTemporaryPassword(
                                  (visible) => !visible
                                )
                              }
                              onMouseDown={(event) => event.preventDefault()}
                              aria-label={
                                showConfirmTemporaryPassword
                                  ? "Hide confirmation password"
                                  : "Show confirmation password"
                              }
                            >
                              {showConfirmTemporaryPassword ? (
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
                </Stack>
              </DialogContent>

              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                  onClick={closeResetPasswordDialog}
                  disabled={resettingPassword}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={resettingPassword}
                  startIcon={<LockReset />}
                >
                  {resettingPassword ? "Resetting..." : "Reset Password"}
                </Button>
              </DialogActions>
            </Box>
          </Dialog>

          <Dialog
            open={statusDialogOpen}
            onClose={closeStatusDialog}
            fullWidth
            maxWidth="xs"
            fullScreen={isMobile}
          >
            <DialogTitle>
              {selectedUser?.active === false
                ? "Reactivate user account?"
                : "Disable user account?"}
            </DialogTitle>

            <DialogContent>
              <DialogContentText>
                {selectedUser?.active === false
                  ? `Reactivate ${selectedUser?.email}? The user will be able to sign in again.`
                  : `Disable ${selectedUser?.email}? The user will no longer be able to sign in.`}
              </DialogContentText>
            </DialogContent>

            <DialogActions
  sx={{
    px: {
      xs: 2,
      sm: 3,
    },
    pb: 2,
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    alignItems: {
      xs: "stretch",
      sm: "center",
    },
    gap: 1,

    "& .MuiButton-root": {
      margin: 0,
      width: {
        xs: "100%",
        sm: "auto",
      },
    },
  }}
>
              <Button onClick={closeStatusDialog} disabled={updatingStatus}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color={selectedUser?.active === false ? "success" : "error"}
                onClick={updateUserStatus}
                disabled={updatingStatus}
              >
                {updatingStatus
                  ? "Saving..."
                  : selectedUser?.active === false
                    ? "Reactivate"
                    : "Disable"}
              </Button>
            </DialogActions>
          </Dialog>

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