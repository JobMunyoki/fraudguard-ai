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
  TablePagination,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Assessment,
  DashboardCustomize,
  History,
  NotificationsActive,
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
    label: "Settings",
    path: "/settings",
    icon: <Settings />,
    roles: ["ADMIN"],
  },
];

function Sidebar() {
  const location = useLocation();

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
  .filter((item) =>
    item.roles.includes(localStorage.getItem("fraudguard_role"))
  )
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

function getActionColor(action) {
  if (action === "TRANSACTION_CREATED") return "primary";
  if (action === "REVIEW_STATUS_UPDATED") return "warning";
  return "default";
}

function formatDateTime(value) {
  if (!value) return "N/A";

  return new Date(value).toLocaleString();
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  async function loadLogs() {
    try {
      setLoading(true);
      const response = await api.get("/audit-logs");
      setLogs(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load audit logs. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const paginatedLogs = logs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
                Audit Logs
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Track system actions, fraud review decisions, and transaction activity
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
              System Audit Trail
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Review all important actions performed in FraudGuard AI.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 2,
                }}
                >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Audit Log Records
                  </Typography>

                  <Typography color="text.secondary">
                    Showing {logs.length} recorded system actions
                  </Typography>
                </Box>
              </Box>

              {logs.length === 0 ? (
                <Typography color="text.secondary">
                  No audit logs recorded yet.
                </Typography>
              ) : (
                <>
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
                          <th style={{ padding: "12px" }}>Action</th>
                          <th style={{ padding: "12px" }}>Transaction</th>
                          <th style={{ padding: "12px" }}>Performed By</th>
                          <th style={{ padding: "12px" }}>Description</th>
                          <th style={{ padding: "12px" }}>Date/Time</th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedLogs.map((log) => (
                          <tr
                            key={log.id}
                            style={{ borderBottom: "1px solid #e2e8f0" }}
                          >
                            <td style={{ padding: "12px" }}>
                              <Chip
                                label={log.action}
                                size="small"
                                color={getActionColor(log.action)}
                                variant="outlined"
                              />
                            </td>

                            <td style={{ padding: "12px" }}>
                              {log.transactionReference || "N/A"}
                            </td>

                            <td style={{ padding: "12px" }}>
                              {log.performedBy || "N/A"}
                            </td>

                            <td style={{ padding: "12px" }}>
                              {log.description || "N/A"}
                            </td>

                            <td style={{ padding: "12px" }}>
                              {formatDateTime(log.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>

                  <TablePagination
                    component="div"
                    count={logs.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}