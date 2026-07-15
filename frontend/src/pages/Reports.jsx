import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  TablePagination,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Assessment,
  AssignmentInd,
  DashboardCustomize,
  History,
  ManageAccounts,
  Download,
  NotificationsActive,
  Person,
  PictureAsPdf,
  ReceiptLong,
  Refresh,
  Settings,
  Warning,
  ReportProblem,
  Shield,
  TrendingUp,
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

const drawerWidth = 260;

const CHART_COLORS = ["#16a34a", "#f97316", "#dc2626", "#2563eb", "#9333ea"];

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

function ReportCard({ title, value, subtitle, icon }) {
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

function getPredictionColor(label) {
  if (label === "FRAUD") return "error";
  if (label === "SUSPICIOUS") return "warning";
  return "success";
}

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [flaggedTransactions, setFlaggedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadReports() {
    try {
      setLoading(true);

      const [statsResponse, transactionsResponse, flaggedResponse] =
        await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/transactions"),
          api.get("/transactions/flagged"),
        ]);

      setStats(statsResponse.data);
      setTransactions(transactionsResponse.data);
      setFlaggedTransactions(flaggedResponse.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load reports. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

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

  const transactionTypeChartData = Object.values(
    transactions.reduce((acc, transaction) => {
      const type = transaction.transactionType || "UNKNOWN";

      if (!acc[type]) {
        acc[type] = {
          type,
          count: 0,
        };
      }

      acc[type].count += 1;

      return acc;
    }, {})
  );

  const paginatedFlaggedTransactions = flaggedTransactions.slice(
  page * rowsPerPage,
  page * rowsPerPage + rowsPerPage
  );

  function exportReportCsv() {
    const rows = [
      [
        "Transaction Reference",
        "Customer ID",
        "Transaction Type",
        "Amount",
        "Old Balance",
        "New Balance",
        "Risk Score",
        "Prediction",
        "Confidence",
        "Prediction Source",
        "Model Used",
        "Review Status",
      ],
      ...transactions.map((transaction) => [
        transaction.transactionReference,
        transaction.customerId,
        transaction.transactionType,
        transaction.amount,
        transaction.oldBalance,
        transaction.newBalance,
        transaction.riskScore,
        transaction.predictionLabel,
        transaction.confidence !== null && transaction.confidence !== undefined
          ? `${Number(transaction.confidence * 100).toFixed(1)}%`
          : "N/A",
        transaction.predictionSource || "UNKNOWN",
        transaction.modelUsed || "N/A",
        transaction.reviewStatus,
      ]),
    ];

    const csvContent = rows
      .map((row) => row.map((value) => `"${value ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "fraudguard-ai-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessMessage("CSV report exported successfully.");
  }

  function exportReportPdf() {
  const doc = new jsPDF();

  const generatedAt = new Date().toLocaleString();

  doc.setFontSize(18);
  doc.text("FraudGuard AI Report", 14, 18);

  doc.setFontSize(10);
  doc.text("AI-Powered Banking Fraud Detection System", 14, 25);
  doc.text(`Generated: ${generatedAt}`, 14, 31);

  doc.setFontSize(13);
  doc.text("Summary Statistics", 14, 43);

  autoTable(doc, {
    startY: 48,
    head: [["Metric", "Value"]],
    body: [
      ["Total Transactions", stats?.totalTransactions ?? 0],
      ["Normal Transactions", stats?.normalTransactions ?? 0],
      ["Suspicious Transactions", stats?.suspiciousTransactions ?? 0],
      ["Fraud Transactions", stats?.fraudTransactions ?? 0],
      ["Pending Reviews", stats?.pendingReviews ?? 0],
      ["Under Review Cases", stats?.underReviewCases ?? 0],
      ["Confirmed Fraud Cases", stats?.confirmedFraudCases ?? 0],
      [
        "Total Flagged Amount",
        `KES ${Number(stats?.totalFlaggedAmount ?? 0).toLocaleString()}`,
      ],
      ["Average Risk Score", Number(stats?.averageRiskScore ?? 0).toFixed(1)],
      ["High Risk Percentage", `${Number(stats?.highRiskPercentage ?? 0).toFixed(1)}%`],
    ],
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  const flaggedRows = flaggedTransactions.map((transaction) => [
    transaction.transactionReference,
    transaction.customerId,
    transaction.transactionType,
    `KES ${Number(transaction.amount || 0).toLocaleString()}`,
    transaction.riskScore,
    transaction.predictionLabel,
    transaction.confidence !== null && transaction.confidence !== undefined
      ? `${Number(transaction.confidence * 100).toFixed(1)}%`
      : "N/A",
    transaction.predictionSource || "UNKNOWN",
    transaction.modelUsed || "N/A",
    transaction.reviewStatus,
  ]);

  doc.setFontSize(13);
  doc.text(
    "Flagged Transactions",
    14,
    doc.lastAutoTable.finalY + 14
  );

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 19,
    head: [
      [
        "Reference",
        "Customer",
        "Type",
        "Amount",
        "Risk",
        "Prediction",
        "Confidence",
        "Source",
        "Model",
        "Review",
      ],
    ],
    body: flaggedRows,
    styles: {
      fontSize: 7,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [220, 38, 38],
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 22 },
      2: { cellWidth: 20 },
      3: { cellWidth: 22 },
      4: { cellWidth: 12 },
      5: { cellWidth: 20 },
      6: { cellWidth: 18 },
      7: { cellWidth: 22 },
      8: { cellWidth: 28 },
      9: { cellWidth: 24 },
    },
  });

  doc.save("fraudguard-ai-report.pdf");

  setSuccessMessage("PDF report exported successfully.");
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
                Reports
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Fraud analytics, transaction summaries, and exportable reports
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
          <Box
            mb={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Fraud Reports
              </Typography>

              <Typography color="text.secondary" mt={1}>
                Summary report of transactions, fraud exposure, and risk analysis.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadReports}
              >
                Refresh
              </Button>

              <Button
                variant="outlined"
                startIcon={<PictureAsPdf />}
                onClick={exportReportPdf}
              >
                Export PDF
              </Button>

              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={exportReportCsv}
              >
                Export CSV
              </Button>
            </Stack>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <ReportCard
                title="Total Transactions"
                value={stats?.totalTransactions ?? 0}
                subtitle="All recorded transactions"
                icon={<ReceiptLong />}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <ReportCard
                title="Fraud Transactions"
                value={stats?.fraudTransactions ?? 0}
                subtitle="High-risk fraud predictions"
                icon={<ReportProblem />}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <ReportCard
                title="Suspicious Transactions"
                value={stats?.suspiciousTransactions ?? 0}
                subtitle="Require analyst review"
                icon={<Warning />}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <ReportCard
                title="Confirmed Fraud"
                value={stats?.confirmedFraudCases ?? 0}
                subtitle="Verified fraud cases"
                icon={<Shield />}
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
                    High Risk Percentage
                  </Typography>

                  <Typography variant="h4" fontWeight="bold" mt={2}>
                    {Number(stats?.highRiskPercentage ?? 0).toFixed(1)}%
                  </Typography>

                  <Typography color="text.secondary" mt={1}>
                    Percentage of suspicious and fraud transactions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Report Charts
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Prediction Breakdown
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
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Review Status Summary
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
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Transactions by Type
                    </Typography>

                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={transactionTypeChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Transactions" fill="#9333ea" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Card sx={{ mt: 4, borderRadius: 3 }}>
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
                    Flagged Transactions Report
                  </Typography>

                  <Typography color="text.secondary">
                    Showing {flaggedTransactions.length} suspicious or fraud transactions
                  </Typography>
                </Box>
              </Box>

              {flaggedTransactions.length === 0 ? (
                <Typography color="text.secondary">
                  No flagged transactions found.
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
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedFlaggedTransactions.map((transaction) => (
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
                            <Chip
                              label={transaction.riskScore}
                              size="small"
                              color={Number(transaction.riskScore) >= 90 ? "error" : "warning"}
                            />
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    </Box>

                        <TablePagination
                          component="div"
                          count={flaggedTransactions.length}
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