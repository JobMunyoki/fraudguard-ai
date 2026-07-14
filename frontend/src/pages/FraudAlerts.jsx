import { useEffect, useMemo, useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,  
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TablePagination,
  TextField,
  Toolbar,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Assessment,
  DashboardCustomize,
  History,
  NotificationsActive,
  ReceiptLong,
  Refresh,
  Search,
  Settings,
  Warning,
  ReportProblem,
  PriorityHigh,
  Visibility,
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

function AlertCard({ title, value, subtitle, icon }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography variant="h4" fontWeight="bold" mt={1}>
              {value}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#dc2626",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function getPredictionColor(label) {
  if (label === "FRAUD") return "error";
  if (label === "SUSPICIOUS") return "warning";
  return "success";
}

export default function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [predictionFilter, setPredictionFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);

  async function loadAlerts() {
    try {
      setLoading(true);

      const response = await api.get("/transactions/flagged");

      setAlerts(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load fraud alerts. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, predictionFilter]);

  async function handleReviewStatus(transactionId, status) {
    try {
      setUpdating(true);

      await api.put(`/transactions/${transactionId}/review-status?status=${status}`);

      setSuccessMessage(`Alert marked as ${status}`);

      await loadAlerts();
    } catch (err) {
      console.error(err);
      setError("Failed to update alert status.");
    } finally {
      setUpdating(false);
    }
  }

  function handleChangePage(event, newPage) {
  setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    }

    function handleOpenDetails(alert) {
    setSelectedAlert(alert);
  }

  function handleCloseDetails() {
    setSelectedAlert(null);
  }

  function formatCurrency(value) {
    return `KES ${Number(value || 0).toLocaleString()}`;
  }

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const searchText = searchTerm.toLowerCase();

      const matchesSearch =
        alert.transactionReference?.toLowerCase().includes(searchText) ||
        alert.customerId?.toLowerCase().includes(searchText) ||
        alert.destinationAccount?.toLowerCase().includes(searchText);

      const matchesPrediction =
        predictionFilter === "ALL" || alert.predictionLabel === predictionFilter;

      return matchesSearch && matchesPrediction;
    });
  }, [alerts, searchTerm, predictionFilter]);

  const paginatedAlerts = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return filteredAlerts.slice(startIndex, endIndex);
  }, [filteredAlerts, page, rowsPerPage]);

  const fraudCount = alerts.filter(
    (alert) => alert.predictionLabel === "FRAUD"
  ).length;

  const suspiciousCount = alerts.filter(
    (alert) => alert.predictionLabel === "SUSPICIOUS"
  ).length;

  const totalAlertAmount = alerts.reduce(
    (sum, alert) => sum + Number(alert.amount || 0),
    0
  );

  const criticalAlerts = alerts.filter(
    (alert) => Number(alert.riskScore || 0) >= 90
  ).length;

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
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
                Fraud Alerts
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Investigate suspicious and high-risk fraud predictions
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <Chip label="Fraud Analyst" color="error" variant="outlined" />
              <Avatar sx={{ bgcolor: "#dc2626" }}>J</Avatar>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold">
              Fraud Alerts Center
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Review transactions classified as suspicious or fraudulent by FraudGuard AI.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={3}>
              <AlertCard
                title="Total Alerts"
                value={alerts.length}
                subtitle="Suspicious + fraud transactions"
                icon={<NotificationsActive />}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <AlertCard
                title="Fraud Alerts"
                value={fraudCount}
                subtitle="High-risk fraud predictions"
                icon={<ReportProblem />}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <AlertCard
                title="Suspicious Alerts"
                value={suspiciousCount}
                subtitle="Require analyst review"
                icon={<Warning />}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <AlertCard
                title="Critical Risk"
                value={criticalAlerts}
                subtitle="Risk score 90 and above"
                icon={<PriorityHigh />}
              />
            </Grid>
          </Grid>

          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Search fraud alerts"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search TXN, customer, or account"
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: "#64748b" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Prediction</InputLabel>
                    <Select
                      label="Prediction"
                      value={predictionFilter}
                      onChange={(event) => setPredictionFilter(event.target.value)}
                    >
                      <MenuItem value="ALL">All Alerts</MenuItem>
                      <MenuItem value="SUSPICIOUS">Suspicious</MenuItem>
                      <MenuItem value="FRAUD">Fraud</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadAlerts}
                  >
                    Refresh
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Total Alert Exposure
              </Typography>

              <Typography variant="h4" fontWeight="bold" mt={2}>
                KES {totalAlertAmount.toLocaleString()}
              </Typography>

              <Typography color="text.secondary" mt={1}>
                Combined amount of all suspicious and fraud transactions.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
                flexWrap="wrap"
                gap={2}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Active Fraud Alerts
                  </Typography>

                  <Typography color="text.secondary">
                    Showing {filteredAlerts.length} of {alerts.length} alerts
                  </Typography>
                </Box>
              </Box>

              {filteredAlerts.length === 0 ? (
                <Typography color="text.secondary">
                No matching fraud alerts found.
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
                        <th style={{ padding: "12px" }}>Reference</th>
                        <th style={{ padding: "12px" }}>Customer</th>
                        <th style={{ padding: "12px" }}>Type</th>
                        <th style={{ padding: "12px" }}>Amount</th>
                        <th style={{ padding: "12px" }}>Risk Score</th>
                        <th style={{ padding: "12px" }}>Prediction</th>
                        <th style={{ padding: "12px" }}>Confidence</th>
                        <th style={{ padding: "12px" }}>Source</th>
                        <th style={{ padding: "12px" }}>Model Used</th>
                        <th style={{ padding: "12px" }}>Review</th>
                        <th style={{ padding: "12px" }}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedAlerts.map((alert) => (
                        <tr
                          key={alert.id}
                          style={{ borderBottom: "1px solid #e2e8f0" }}
                        >
                          <td style={{ padding: "12px" }}>
                            {alert.transactionReference}
                          </td>

                          <td style={{ padding: "12px" }}>{alert.customerId}</td>

                          <td style={{ padding: "12px" }}>
                            {alert.transactionType}
                          </td>

                          <td style={{ padding: "12px" }}>
                            KES {Number(alert.amount).toLocaleString()}
                          </td>

                          <td style={{ padding: "12px" }}>
                            <Chip
                              label={alert.riskScore}
                              size="small"
                              color={Number(alert.riskScore) >= 90 ? "error" : "warning"}
                            />
                          </td>

                          <td style={{ padding: "12px" }}>
                            <Chip
                                label={alert.predictionLabel}
                                size="small"
                                color={getPredictionColor(alert.predictionLabel)}
                            />
                            </td>

                            <td style={{ padding: "12px" }}>
                            {alert.confidence !== null && alert.confidence !== undefined
                                ? `${Number(alert.confidence * 100).toFixed(1)}%`
                                : "N/A"}
                            </td>

                            <td style={{ padding: "12px" }}>
                            <Chip
                                label={alert.predictionSource || "UNKNOWN"}
                                size="small"
                                color={alert.predictionSource === "AI_SERVICE" ? "primary" : "default"}
                                variant="outlined"
                            />
                            </td>

                            <td style={{ padding: "12px" }}>
                            {alert.modelUsed || "N/A"}
                            </td>

                            <td style={{ padding: "12px" }}>
                            <Chip
                                label={alert.reviewStatus}
                                size="small"
                                variant="outlined"
                            />
                            </td>

                          <td style={{ padding: "12px" }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => handleOpenDetails(alert)}
                              >
                                Details
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                disabled={updating}
                                onClick={() =>
                                  handleReviewStatus(alert.id, "UNDER_REVIEW")
                                }
                              >
                                Review
                              </Button>

                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                disabled={updating}
                                onClick={() =>
                                  handleReviewStatus(alert.id, "CONFIRMED_FRAUD")
                                }
                              >
                                Confirm Fraud
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                disabled={updating}
                                onClick={() =>
                                  handleReviewStatus(alert.id, "FALSE_POSITIVE")
                                }
                              >
                                False Positive
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                color="secondary"
                                disabled={updating}
                                onClick={() =>
                                  handleReviewStatus(alert.id, "RESOLVED")
                                }
                              >
                                Resolve
                              </Button>
                            </Stack>
                          </td>
                        </tr>
                      ))}
                    </tbody>
              </table>
                </Box>

                <TablePagination
                  component="div"
                  count={filteredAlerts.length}
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

<Dialog
  open={Boolean(selectedAlert)}
  onClose={handleCloseDetails}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    <Typography variant="h6" fontWeight="bold">
      Fraud Alert Details
    </Typography>

    <Typography variant="body2" color="text.secondary">
      Full fraud alert investigation and AI prediction details
    </Typography>
  </DialogTitle>

  <DialogContent dividers>
    {selectedAlert && (
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Transaction Information
                </Typography>

                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Reference
                    </Typography>
                    <Typography fontWeight="bold">
                      {selectedAlert.transactionReference}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Customer ID
                    </Typography>
                    <Typography fontWeight="bold">
                      {selectedAlert.customerId}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Transaction Type
                    </Typography>
                    <Typography fontWeight="bold">
                      {selectedAlert.transactionType}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Destination Account
                    </Typography>
                    <Typography fontWeight="bold">
                      {selectedAlert.destinationAccount || "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Balance Movement
                </Typography>

                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography fontWeight="bold">
                      {formatCurrency(selectedAlert.amount)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Old Balance
                    </Typography>
                    <Typography fontWeight="bold">
                      {formatCurrency(selectedAlert.oldBalance)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      New Balance
                    </Typography>
                    <Typography fontWeight="bold">
                      {formatCurrency(selectedAlert.newBalance)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Fraud Investigation Summary
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Risk Score
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        label={selectedAlert.riskScore}
                        color={
                          Number(selectedAlert.riskScore) >= 70
                            ? "error"
                            : Number(selectedAlert.riskScore) >= 40
                            ? "warning"
                            : "success"
                        }
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Prediction
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        label={selectedAlert.predictionLabel}
                        color={getPredictionColor(selectedAlert.predictionLabel)}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Confidence
                    </Typography>
                    <Typography fontWeight="bold" mt={1}>
                      {selectedAlert.confidence !== null &&
                      selectedAlert.confidence !== undefined
                        ? `${Number(selectedAlert.confidence * 100).toFixed(1)}%`
                        : "N/A"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Review Status
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        label={selectedAlert.reviewStatus}
                        variant="outlined"
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Prediction Source
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        label={selectedAlert.predictionSource || "UNKNOWN"}
                        color={
                          selectedAlert.predictionSource === "AI_SERVICE"
                            ? "primary"
                            : "default"
                        }
                        variant="outlined"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Model Used
                    </Typography>
                    <Typography fontWeight="bold" mt={1}>
                      {selectedAlert.modelUsed || "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={handleCloseDetails}>Close</Button>

    {selectedAlert && (
      <>
        <Button
          variant="outlined"
          onClick={() =>
            handleReviewStatus(selectedAlert.id, "UNDER_REVIEW")
          }
          disabled={updating}
        >
          Mark Under Review
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() =>
            handleReviewStatus(selectedAlert.id, "CONFIRMED_FRAUD")
          }
          disabled={updating}
        >
          Confirm Fraud
        </Button>

        <Button
          variant="outlined"
          color="success"
          onClick={() =>
            handleReviewStatus(selectedAlert.id, "FALSE_POSITIVE")
          }
          disabled={updating}
        >
          False Positive
        </Button>
      </>
    )}
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