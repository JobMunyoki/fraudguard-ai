import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  AccountBalance,
  Warning,
  Shield,
  PendingActions,
  VerifiedUser,
  TrendingUp,
  ReportProblem,
  Assessment,
  AssignmentInd,
  Add,
  Refresh,
  DashboardCustomize,
  History,
  ManageAccounts,
  ReceiptLong,
  NotificationsActive,
  NotificationsNone,
  Person,
  Settings,
} from "@mui/icons-material";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axiosConfig";

const initialForm = {
  transactionReference: "",
  customerId: "",
  transactionType: "TRANSFER",
  amount: "",
  oldBalance: "",
  newBalance: "",
  destinationAccount: "",
};

const CHART_COLORS = ["#16a34a", "#f97316", "#dc2626", "#2563eb", "#9333ea"];

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

function StatCard({ title, value, subtitle, icon }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>

            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>

            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

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
      
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [flaggedTransactions, setFlaggedTransactions] = useState([]);
  const [form, setForm] = useState(initialForm);  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [alertAnchorEl, setAlertAnchorEl] = useState(null);

  const role = localStorage.getItem("fraudguard_role");
  const canManageTransactions = role === "ADMIN" || role === "FRAUD_ANALYST";

  async function loadDashboardData() {
  try {
    setLoading(true);

    const statsResponse = await api.get("/dashboard/stats");
    setStats(statsResponse.data);

    if (canManageTransactions) {
      const [transactionsResponse, flaggedResponse] = await Promise.all([
        api.get("/transactions"),
        api.get("/transactions/flagged"),
      ]);

      setTransactions(transactionsResponse.data);
      setFlaggedTransactions(flaggedResponse.data);
    } else {
      setTransactions([]);
      setFlaggedTransactions([]);
    }

    setError("");
  } catch (err) {
    console.error(err);
    setError(
      "Failed to load dashboard data. Make sure the backend is running on port 8080."
    );
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    loadDashboardData();
  }, []);

    const predictionChartData = [
    {
      name: "Normal",
      value: stats?.normalTransactions ?? 0,
    },
    {
      name: "Suspicious",
      value: stats?.suspiciousTransactions ?? 0,
    },
    {
      name: "Fraud",
      value: stats?.fraudTransactions ?? 0,
    },
  ];

  const reviewStatusChartData = [
    {
      status: "Pending",
      count: stats?.pendingReviews ?? 0,
    },
    {
      status: "Under Review",
      count: stats?.underReviewCases ?? 0,
    },
    {
      status: "Confirmed Fraud",
      count: stats?.confirmedFraudCases ?? 0,
    },
  ];

  const riskDistributionData = [
    {
      range: "Low Risk",
      count: transactions.filter((transaction) => transaction.riskScore < 40)
        .length,
    },
    {
      range: "Medium Risk",
      count: transactions.filter(
        (transaction) =>
          transaction.riskScore >= 40 && transaction.riskScore < 70
      ).length,
    },
    {
      range: "High Risk",
      count: transactions.filter((transaction) => transaction.riskScore >= 70)
        .length,
    },
  ];

  const criticalAlerts = flaggedTransactions
  .filter((transaction) => transaction.riskScore >= 70)
  .slice(0, 5);

const openAlertCenter = Boolean(alertAnchorEl);

function handleOpenAlertCenter(event) {
  setAlertAnchorEl(event.currentTarget);
}

function handleCloseAlertCenter() {
  setAlertAnchorEl(null);
}

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.transactionReference ||
      !form.customerId ||
      !form.amount ||
      !form.oldBalance ||
      !form.newBalance
    ) {
      setError("Please fill in transaction reference, customer ID, amount, old balance, and new balance.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        transactionReference: form.transactionReference,
        customerId: form.customerId,
        transactionType: form.transactionType,
        amount: Number(form.amount),
        oldBalance: Number(form.oldBalance),
        newBalance: Number(form.newBalance),
        destinationAccount: form.destinationAccount,
      };

      const response = await api.post("/transactions", payload);

      setSuccessMessage(
        `Transaction ${response.data.transactionReference} saved as ${response.data.predictionLabel}`
      );

      setForm(initialForm);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      setError(
        "Failed to save transaction. Make sure the transaction reference is unique, for example TXN-004."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReviewStatus(transactionId, status) {
    try {
        await api.put(`/transactions/${transactionId}/review-status?status=${status}`);

        setSuccessMessage(`Transaction marked as ${status}`);

        await loadDashboardData();
    } catch (err) {
        console.error(err);
        setError("Failed to update review status. Make sure the backend is running.");
    }
    }

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
              Dashboard
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Monitor transactions, fraud alerts, and analyst reviews
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
          {canManageTransactions && (
  <>
    <IconButton color="primary" onClick={handleOpenAlertCenter}>
      <Badge badgeContent={criticalAlerts.length} color="error">
        <NotificationsNone />
      </Badge>
    </IconButton>

    <Popover
      open={openAlertCenter}
      anchorEl={alertAnchorEl}
      onClose={handleCloseAlertCenter}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box sx={{ width: 360, p: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Alert Center
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Latest high-risk fraud alerts
        </Typography>

        {criticalAlerts.length === 0 ? (
          <Typography color="text.secondary">
            No critical alerts at the moment.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {criticalAlerts.map((transaction) => (
              <Card key={transaction.id} variant="outlined">
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold">
                      {transaction.transactionReference}
                    </Typography>

                    <Chip
                      label={transaction.predictionLabel}
                      size="small"
                      color={
                        transaction.predictionLabel === "FRAUD"
                          ? "error"
                          : "warning"
                      }
                    />
                  </Stack>

                  <Typography variant="body2" mt={1}>
                    Customer: {transaction.customerId}
                  </Typography>

                  <Typography variant="body2">
                    Amount: KES {Number(transaction.amount).toLocaleString()}
                  </Typography>

                  <Typography variant="body2">
                    Risk Score: {transaction.riskScore}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Review Status: {transaction.reviewStatus}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Popover>
  </>
)}
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
            FraudGuard AI Dashboard
          </Typography>

          <Typography color="text.secondary" mt={1}>
            AI-powered banking fraud monitoring and transaction risk overview.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {canManageTransactions && (
          <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              gap={2}
              flexWrap="wrap"
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Add New Transaction
                </Typography>

                <Typography color="text.secondary">
                  Enter transaction details and FraudGuard AI will assign a risk score.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadDashboardData}
              >
                Refresh
              </Button>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    required
                    label="Transaction Reference"
                    name="transactionReference"
                    value={form.transactionReference}
                    onChange={handleChange}
                    placeholder="TXN-004"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    required
                    label="Customer ID"
                    name="customerId"
                    value={form.customerId}
                    onChange={handleChange}
                    placeholder="CUST-1004"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Transaction Type"
                    name="transactionType"
                    value={form.transactionType}
                    onChange={handleChange}
                  >
                    <MenuItem value="CASH_IN">CASH_IN</MenuItem>
                    <MenuItem value="CASH_OUT">CASH_OUT</MenuItem>
                    <MenuItem value="DEBIT">DEBIT</MenuItem>
                    <MenuItem value="PAYMENT">PAYMENT</MenuItem>
                    <MenuItem value="TRANSFER">TRANSFER</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Amount"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="85000"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Old Balance"
                    name="oldBalance"
                    value={form.oldBalance}
                    onChange={handleChange}
                    placeholder="90000"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="New Balance"
                    name="newBalance"
                    value={form.newBalance}
                    onChange={handleChange}
                    placeholder="5000"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Destination Account"
                    name="destinationAccount"
                    value={form.destinationAccount}
                    onChange={handleChange}
                    placeholder="ACC-9004"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Stack height="100%" justifyContent="center">
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Add />}
                      disabled={submitting}
                    >
                      {submitting ? "Saving..." : "Add Transaction"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}  

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Transactions"
              value={stats?.totalTransactions ?? 0}
              subtitle="All recorded transactions"
              icon={<AccountBalance />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Normal Transactions"
              value={stats?.normalTransactions ?? 0}
              subtitle="Low-risk transactions"
              icon={<Shield />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Suspicious Transactions"
              value={stats?.suspiciousTransactions ?? 0}
              subtitle="Require analyst attention"
              icon={<Warning />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Fraud Transactions"
              value={stats?.fraudTransactions ?? 0}
              subtitle="High-risk fraud predictions"
              icon={<ReportProblem />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Reviews"
              value={stats?.pendingReviews ?? 0}
              subtitle="Waiting for review"
              icon={<PendingActions />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Under Review"
              value={stats?.underReviewCases ?? 0}
              subtitle="Being investigated"
              icon={<Assessment />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Confirmed Fraud"
              value={stats?.confirmedFraudCases ?? 0}
              subtitle="Verified fraud cases"
              icon={<VerifiedUser />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="High Risk Rate"
              value={`${Number(stats?.highRiskPercentage ?? 0).toFixed(1)}%`}
              subtitle="Suspicious + fraud percentage"
              icon={<TrendingUp />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Total Flagged Amount
                </Typography>

                <Typography variant="h4" fontWeight="bold" mt={2}>
                  KES {Number(stats?.totalFlaggedAmount ?? 0).toLocaleString()}
                </Typography>

                <Typography color="text.secondary" mt={1}>
                  Combined value of suspicious and fraud transactions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Average Risk Score
                </Typography>

                <Typography variant="h4" fontWeight="bold" mt={2}>
                  {Number(stats?.averageRiskScore ?? 0).toFixed(1)}
                </Typography>

                <Typography color="text.secondary" mt={1}>
                  Average fraud risk across all transactions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Flagged Transactions
                </Typography>

                <Typography variant="h4" fontWeight="bold" mt={2}>
                  {flaggedTransactions.length}
                </Typography>

                <Typography color="text.secondary" mt={1}>
                  Transactions classified as suspicious or fraud.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

<Box mt={4}>
  <Typography variant="h6" fontWeight="bold" mb={2}>
    Fraud Analytics Charts
  </Typography>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "repeat(3, 1fr)",
      },
      gap: 3,
    }}
  >
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Fraud Prediction Summary
        </Typography>

        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={predictionChartData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {predictionChartData.map((entry, index) => (
                <Cell
                  key={`prediction-cell-${entry.name}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Review Status Overview
        </Typography>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={reviewStatusChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Transactions" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Risk Distribution
        </Typography>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={riskDistributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Transactions" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </Box>
</Box>

        {canManageTransactions && (
          <Card sx={{ mt: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Recent Transactions
            </Typography>

        

               
            {transactions.length === 0 ? (
              <Typography color="text.secondary">No transactions found.</Typography>
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
                      <th style={{ padding: "12px" }}>Risk Score</th>
                      <th style={{ padding: "12px" }}>Prediction</th>
                      <th style={{ padding: "12px" }}>Confidence</th>
                      <th style={{ padding: "12px" }}>Source</th>
                      <th style={{ padding: "12px" }}>Review Status</th>
                      <th style={{ padding: "12px" }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.slice(0, 10).map((transaction) => (
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
                          {transaction.riskScore}
                        </td>

                        <td style={{ padding: "12px" }}>
                          <Chip
                            label={transaction.predictionLabel}
                            size="small"
                            color={
                              transaction.predictionLabel === "FRAUD"
                                ? "error"
                                : transaction.predictionLabel === "SUSPICIOUS"
                                ? "warning"
                                : "success"
                            }
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
                                onClick={() => handleReviewStatus(transaction.id, "UNDER_REVIEW")}
                                >
                                Review
                                </Button>

                                <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => handleReviewStatus(transaction.id, "CONFIRMED_FRAUD")}
                                >
                                Confirm Fraud
                                </Button>

                                <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                onClick={() => handleReviewStatus(transaction.id, "FALSE_POSITIVE")}
                                >
                                False Positive
                                </Button>

                                <Button
                                size="small"
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleReviewStatus(transaction.id, "RESOLVED")}
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
      )}

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