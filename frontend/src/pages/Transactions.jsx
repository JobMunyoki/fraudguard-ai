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
  Divider,
  Drawer,
  FormControl,
  Grid,
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
  Typography,
} from "@mui/material";
import {
  Assessment,
  DashboardCustomize,
  NotificationsActive,
  ReceiptLong,
  Refresh,
  Search,
  Settings,
} from "@mui/icons-material";
import api from "../api/axiosConfig";

const drawerWidth = 260;

const sidebarItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardCustomize />,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: <ReceiptLong />,
  },
  {
    label: "Fraud Alerts",
    path: "/fraud-alerts",
    icon: <NotificationsActive />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <Assessment />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings />,
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
        {sidebarItems.map((item) => {
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

function getPredictionColor(label) {
  if (label === "FRAUD") return "error";
  if (label === "SUSPICIOUS") return "warning";
  return "success";
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [predictionFilter, setPredictionFilter] = useState("ALL");
  const [reviewFilter, setReviewFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadTransactions() {
    try {
      setLoading(true);
      const response = await api.get("/transactions");
      setTransactions(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  async function handleReviewStatus(transactionId, status) {
    try {
      setUpdating(true);

      await api.put(`/transactions/${transactionId}/review-status?status=${status}`);

      setSuccessMessage(`Transaction marked as ${status}`);

      await loadTransactions();
    } catch (err) {
      console.error(err);
      setError("Failed to update review status.");
    } finally {
      setUpdating(false);
    }
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchText = searchTerm.toLowerCase();

      const matchesSearch =
        transaction.transactionReference?.toLowerCase().includes(searchText) ||
        transaction.customerId?.toLowerCase().includes(searchText) ||
        transaction.destinationAccount?.toLowerCase().includes(searchText);

      const matchesPrediction =
        predictionFilter === "ALL" ||
        transaction.predictionLabel === predictionFilter;

      const matchesReview =
        reviewFilter === "ALL" || transaction.reviewStatus === reviewFilter;

      return matchesSearch && matchesPrediction && matchesReview;
    });
  }, [transactions, searchTerm, predictionFilter, reviewFilter]);

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
                Transactions
              </Typography>

              <Typography variant="caption" color="text.secondary">
                View, search, filter, and review banking transactions
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <Chip label="Admin" color="primary" variant="outlined" />
              <Avatar sx={{ bgcolor: "#2563eb" }}>J</Avatar>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold">
              Transaction Management
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Manage all recorded bank transactions and fraud review decisions.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Search transactions"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search TXN, customer, or account"
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: "#64748b" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Prediction</InputLabel>
                    <Select
                      label="Prediction"
                      value={predictionFilter}
                      onChange={(event) => setPredictionFilter(event.target.value)}
                    >
                      <MenuItem value="ALL">All Predictions</MenuItem>
                      <MenuItem value="NORMAL">Normal</MenuItem>
                      <MenuItem value="SUSPICIOUS">Suspicious</MenuItem>
                      <MenuItem value="FRAUD">Fraud</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Review Status</InputLabel>
                    <Select
                      label="Review Status"
                      value={reviewFilter}
                      onChange={(event) => setReviewFilter(event.target.value)}
                    >
                      <MenuItem value="ALL">All Statuses</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                      <MenuItem value="CONFIRMED_FRAUD">Confirmed Fraud</MenuItem>
                      <MenuItem value="FALSE_POSITIVE">False Positive</MenuItem>
                      <MenuItem value="RESOLVED">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadTransactions}
                  >
                    Refresh
                  </Button>
                </Grid>
              </Grid>
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
                    All Transactions
                  </Typography>

                  <Typography color="text.secondary">
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                  </Typography>
                </Box>
              </Box>

              {filteredTransactions.length === 0 ? (
                <Typography color="text.secondary">
                  No matching transactions found.
                </Typography>
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
                        <th style={{ padding: "12px" }}>Reference</th>
                        <th style={{ padding: "12px" }}>Customer</th>
                        <th style={{ padding: "12px" }}>Type</th>
                        <th style={{ padding: "12px" }}>Amount</th>
                        <th style={{ padding: "12px" }}>Old Balance</th>
                        <th style={{ padding: "12px" }}>New Balance</th>
                        <th style={{ padding: "12px" }}>Risk</th>
                        <th style={{ padding: "12px" }}>Prediction</th>
                        <th style={{ padding: "12px" }}>Confidence</th>
                        <th style={{ padding: "12px" }}>Source</th>
                        <th style={{ padding: "12px" }}>Model Used</th>
                        <th style={{ padding: "12px" }}>Review</th>
                        <th style={{ padding: "12px" }}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          style={{ borderBottom: "1px solid #e2e8f0" }}
                        >
                          <td style={{ padding: "12px" }}>
                            {transaction.transactionReference}
                          </td>

                          <td style={{ padding: "12px" }}>
                            {transaction.customerId}
                          </td>

                          <td style={{ padding: "12px" }}>
                            {transaction.transactionType}
                          </td>

                          <td style={{ padding: "12px" }}>
                            KES {Number(transaction.amount).toLocaleString()}
                          </td>

                          <td style={{ padding: "12px" }}>
                            KES {Number(transaction.oldBalance).toLocaleString()}
                          </td>

                          <td style={{ padding: "12px" }}>
                            KES {Number(transaction.newBalance).toLocaleString()}
                          </td>

                          <td style={{ padding: "12px" }}>
                            {transaction.riskScore}
                          </td>

                          <td style={{ padding: "12px" }}>
                            <Chip
                                label={transaction.predictionLabel}
                                size="small"
                                color={getPredictionColor(transaction.predictionLabel)}
                            />
                            </td>

                            <td style={{ padding: "12px" }}>
                            {transaction.confidence !== null && transaction.confidence !== undefined
                                ? `${Number(transaction.confidence * 100).toFixed(1)}%`
                                : "N/A"}
                            </td>

                            <td style={{ padding: "12px" }}>
                            <Chip
                                label={transaction.predictionSource || "UNKNOWN"}
                                size="small"
                                color={transaction.predictionSource === "AI_SERVICE" ? "primary" : "default"}
                                variant="outlined"
                            />
                            </td>

                            <td style={{ padding: "12px" }}>
                            {transaction.modelUsed || "N/A"}
                            </td>

                            <td style={{ padding: "12px" }}>
                            <Chip
                                label={transaction.reviewStatus}
                                size="small"
                                variant="outlined"
                            />
                            </td>

                          <td style={{ padding: "12px" }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              <Button
                                size="small"
                                variant="outlined"
                                disabled={updating}
                                onClick={() =>
                                  handleReviewStatus(transaction.id, "UNDER_REVIEW")
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
                                  handleReviewStatus(transaction.id, "CONFIRMED_FRAUD")
                                }
                              >
                                Confirm
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                disabled={updating}
                                onClick={() =>
                                  handleReviewStatus(transaction.id, "FALSE_POSITIVE")
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
                                  handleReviewStatus(transaction.id, "RESOLVED")
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