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
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Assessment,
  DashboardCustomize,
  History,
  ManageAccounts,
  NotificationsActive,
  Person,
  ReceiptLong,
  Settings,
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

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <Card sx={{ backgroundColor: "#1e293b", color: "#ffffff", borderRadius: 3 }}>
          <CardContent>
            <Typography variant="body2" fontWeight="bold">
              System Status
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
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
    </Drawer>
  );
}

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  useEffect(() => {
    loadUsers();
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
                User Management
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Manage FraudGuard AI users and access roles
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

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold">
              System Users
            </Typography>
            <Typography color="text.secondary" mt={1}>
              View users and update their access level.
            </Typography>
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
                <Typography color="text.secondary">No users found.</Typography>
              ) : (
                <Box sx={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "14px",
                    }}
                  >
                    <thead>
                      <tr style={{ textAlign: "left", backgroundColor: "#f1f5f9" }}>
                        <th style={{ padding: "12px" }}>Full Name</th>
                        <th style={{ padding: "12px" }}>Email</th>
                        <th style={{ padding: "12px" }}>Role</th>
                        <th style={{ padding: "12px" }}>Created At</th>
                        <th style={{ padding: "12px" }}>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                          <td style={{ padding: "12px" }}>{user.fullName}</td>
                          <td style={{ padding: "12px" }}>{user.email}</td>
                          <td style={{ padding: "12px" }}>
                            <Chip
                              label={user.role}
                              color={user.role === "ADMIN" ? "primary" : "default"}
                              variant="outlined"
                              size="small"
                            />
                          </td>
                          <td style={{ padding: "12px" }}>{formatDate(user.createdAt)}</td>
                          <td style={{ padding: "12px" }}>
                            <Select
                              size="small"
                              value={user.role}
                              onChange={(event) =>
                                updateUserRole(user.id, event.target.value)
                              }
                              disabled={
                                user.email === localStorage.getItem("fraudguard_email")
                              }
                            >
                              <MenuItem value="ADMIN">ADMIN</MenuItem>
                              <MenuItem value="FRAUD_ANALYST">FRAUD_ANALYST</MenuItem>
                              <MenuItem value="VIEWER">VIEWER</MenuItem>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}
            </CardContent>
          </Card>

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