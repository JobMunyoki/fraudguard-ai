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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Assessment,
  AssignmentInd,
  DashboardCustomize,
  History,
  ManageAccounts,
  Menu,
  NotificationsActive,
  Person,
  ReceiptLong,
  Settings,
} from "@mui/icons-material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
          sx={{
            color: "#94a3b8",
            mt: 0.5,
          }}
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
            const isActive =
              location.pathname === item.path;

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
            <Typography
              variant="body2"
              fontWeight="bold"
            >
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
        ModalProps={{
          keepMounted: true,
        }}
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

function getWorkloadLevel(totalCases) {
  if (totalCases >= 10) return { label: "Heavy", color: "error" };
  if (totalCases >= 5) return { label: "Moderate", color: "warning" };
  return { label: "Light", color: "success" };
}

export default function AnalystWorkload() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleMobileMenuOpen() {
    setMobileOpen(true);
  }

  function handleMobileMenuClose() {
    setMobileOpen(false);
  }

  async function loadWorkload() {
  try {
    setLoading(true);
    setError("");

    const response = await api.get("/analyst-workload");

    setWorkload(Array.isArray(response.data) ? response.data : []);
  } catch (err) {
    console.error("Analyst workload error:", err);

    if (err.response?.status === 401) {
      setError("You are not logged in. Please login as admin again.");
    } else if (err.response?.status === 403) {
      setError("Access denied. Analyst Workload is for ADMIN only.");
    } else if (err.code === "ECONNABORTED") {
      setError("Request timed out. Make sure the backend is running on port 8080.");
    } else {
      setError("Failed to load analyst workload. Check backend and token.");
    }

    setWorkload([]);
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    loadWorkload();
  }, []);

  const totalAnalysts = workload.length;
  const totalAssignedCases = workload.reduce(
    (sum, item) => sum + item.totalAssignedCases,
    0
  );
  const totalUnderReview = workload.reduce(
    (sum, item) => sum + item.underReviewCases,
    0
  );
  const totalHighRisk = workload.reduce((sum, item) => sum + item.highRiskCases, 0);

  if (loading) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

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
      Analyst Workload
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
      Monitor fraud analyst case distribution
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
          <Box mb={4}>
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
              Analyst Workload Dashboard
            </Typography>

            <Typography color="text.secondary" mt={1}>
              View assigned fraud cases per analyst and balance investigations fairly.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={3}>
            <Card sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">Fraud Analysts</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalAnalysts}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">Total Assigned Cases</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalAssignedCases}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">Under Review</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalUnderReview}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">High Risk Cases</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalHighRisk}
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Box
  sx={{
    display: "flex",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    justifyContent: "space-between",
    alignItems: {
      xs: "stretch",
      sm: "center",
    },
    gap: 2,
    mb: 2,
  }}
>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Workload Chart
                  </Typography>
                  <Typography color="text.secondary">
                    Assigned, under review, and high risk cases per analyst
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  onClick={loadWorkload}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },
                  }}
                >
                  Refresh
                </Button>
              </Box>

              {workload.length === 0 ? (
                <Typography color="text.secondary">
                  No fraud analysts found.
                </Typography>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: {
                      xs: 320,
                      md: 360,
                    },
                    minWidth: 0,
                  }}
                >
                  <ResponsiveContainer>
                    <BarChart data={workload}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="fullName"
                        angle={-25}
                        textAnchor="end"
                        interval={0}
                        height={70}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalAssignedCases" name="Total Assigned" />
                      <Bar dataKey="underReviewCases" name="Under Review" />
                      <Bar dataKey="highRiskCases" name="High Risk" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Analyst Workload Table
              </Typography>

              {workload.length === 0 ? (
                <Typography color="text.secondary">
                  No workload records available.
                </Typography>
              ) : (
                <>
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
                    <thead>
                      <tr style={{ textAlign: "left", backgroundColor: "#f1f5f9" }}>
                        <th style={{ padding: "12px" }}>Analyst</th>
                        <th style={{ padding: "12px" }}>Email</th>
                        <th style={{ padding: "12px" }}>Workload</th>
                        <th style={{ padding: "12px" }}>Total</th>
                        <th style={{ padding: "12px" }}>Pending</th>
                        <th style={{ padding: "12px" }}>Under Review</th>
                        <th style={{ padding: "12px" }}>Confirmed Fraud</th>
                        <th style={{ padding: "12px" }}>False Positive</th>
                        <th style={{ padding: "12px" }}>Resolved</th>
                        <th style={{ padding: "12px" }}>High Risk</th>
                      </tr>
                    </thead>

                    <tbody>
                      {workload.map((item) => {
                        const workloadLevel = getWorkloadLevel(
                          item.totalAssignedCases
                        );

                        return (
                          <tr
                            key={item.userId}
                            style={{ borderBottom: "1px solid #e2e8f0" }}
                          >
                            <td style={{ padding: "12px" }}>{item.fullName}</td>
                            <td style={{ padding: "12px" }}>{item.email}</td>
                            <td style={{ padding: "12px" }}>
                              <Chip
                                label={workloadLevel.label}
                                color={workloadLevel.color}
                                size="small"
                              />
                            </td>
                            <td style={{ padding: "12px" }}>
                              {item.totalAssignedCases}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {item.pendingCases}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {item.underReviewCases}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {item.confirmedFraudCases}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {item.falsePositiveCases}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {item.resolvedCases}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {item.highRiskCases}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Box>
                <Stack
  spacing={2}
  sx={{
    display: {
      xs: "flex",
      md: "none",
    },
  }}
>
  {workload.map((item) => {
    const workloadLevel = getWorkloadLevel(
      item.totalAssignedCases
    );

    return (
      <Card
        key={item.userId}
        variant="outlined"
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Analyst
              </Typography>

              <Typography fontWeight="bold">
                {item.fullName}
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
                {item.email}
              </Typography>
            </Box>

            <Box>
              <Chip
                label={workloadLevel.label}
                color={workloadLevel.color}
                size="small"
              />
            </Box>

            <Divider />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Total
                </Typography>

                <Typography fontWeight="bold">
                  {item.totalAssignedCases}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Pending
                </Typography>

                <Typography fontWeight="bold">
                  {item.pendingCases}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Under Review
                </Typography>

                <Typography fontWeight="bold">
                  {item.underReviewCases}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  High Risk
                </Typography>

                <Typography fontWeight="bold">
                  {item.highRiskCases}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Confirmed Fraud
                </Typography>

                <Typography fontWeight="bold">
                  {item.confirmedFraudCases}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  False Positive
                </Typography>

                <Typography fontWeight="bold">
                  {item.falsePositiveCases}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Resolved
                </Typography>

                <Typography fontWeight="bold">
                  {item.resolvedCases}
                </Typography>
              </Box>
            </Box>
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
        </Container>
      </Box>
    </Box>
  );
}