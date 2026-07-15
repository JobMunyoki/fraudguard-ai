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
  FormControl,
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

function getPredictionColor(label) {
  if (label === "FRAUD") return "error";
  if (label === "SUSPICIOUS") return "warning";
  return "success";
}

function formatCurrency(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

const CLOSED_REVIEW_STATUSES = [
  "CONFIRMED_FRAUD",
  "FALSE_POSITIVE",
  "RESOLVED",
];

function isCaseClosed(reviewStatus) {
  return CLOSED_REVIEW_STATUSES.includes(reviewStatus);
}

function getSlaStatus(caseItem) {
  if (!caseItem.slaDueAt) {
    return {
      label: "NO SLA",
      color: "default",
    };
  }

  if (isCaseClosed(caseItem.reviewStatus)) {
    return {
      label: "COMPLETED",
      color: "success",
    };
  }

  const now = new Date();
  const slaDueDate = new Date(caseItem.slaDueAt);

  if (slaDueDate < now) {
    return {
      label: "OVERDUE",
      color: "error",
    };
  }

  return {
    label: "ON TIME",
    color: "primary",
  };
}

function formatDateTime(value) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString();
}

export default function MyAssignedCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCase, setSelectedCase] = useState(null);
  const [investigationNotes, setInvestigationNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  async function loadAssignedCases() {
    try {
      setLoading(true);

      const response = await api.get("/transactions/assigned-to-me");

      setCases(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load assigned cases.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReviewStatus(transactionId, status) {
    try {
      setUpdating(true);

      await api.put(`/transactions/${transactionId}/review-status?status=${status}`);

      setSuccessMessage(`Case marked as ${status}`);
      await loadAssignedCases();
    } catch (err) {
      console.error(err);
      setError("Failed to update case status.");
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
  loadAssignedCases();
}, []);

  useEffect(() => {
    setPage(0);
  }, [statusFilter]);

  const filteredCases = useMemo(() => {
  if (statusFilter === "ALL") {
    return cases;
  }

  return cases.filter((item) => item.reviewStatus === statusFilter);
}, [cases, statusFilter]);

const paginatedCases = useMemo(() => {
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return filteredCases.slice(startIndex, endIndex);
}, [filteredCases, page, rowsPerPage]);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const pendingCases = cases.filter((item) => item.reviewStatus === "PENDING").length;
  const underReviewCases = cases.filter((item) => item.reviewStatus === "UNDER_REVIEW").length;
  const confirmedFraudCases = cases.filter(
    (item) => item.reviewStatus === "CONFIRMED_FRAUD"
  ).length;

  async function loadInvestigationNotes(transactionId) {
  try {
    setLoadingNotes(true);

    const response = await api.get(`/transactions/${transactionId}/notes`);

    setInvestigationNotes(response.data);
  } catch (err) {
    console.error(err);
    setError("Failed to load investigation notes.");
  } finally {
    setLoadingNotes(false);
  }
}

async function handleOpenDetails(caseItem) {
  setSelectedCase(caseItem);
  setNoteText("");
  await loadInvestigationNotes(caseItem.id);
}

function handleCloseDetails() {
  setSelectedCase(null);
  setInvestigationNotes([]);
  setNoteText("");
}

async function handleAddInvestigationNote() {
  if (!selectedCase) {
    return;
  }

  if (!noteText.trim()) {
    setError("Please enter an investigation note.");
    return;
  }

  try {
    setSavingNote(true);

    const response = await api.post(
      `/transactions/${selectedCase.id}/notes`,
      {
        note: noteText,
      }
    );

    setInvestigationNotes((previousNotes) => [
      response.data,
      ...previousNotes,
    ]);

    setNoteText("");
    setSuccessMessage("Investigation note added successfully.");
  } catch (err) {
    console.error(err);
    setError("Failed to add investigation note.");
  } finally {
    setSavingNote(false);
  }
}

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
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
                My Assigned Cases
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Fraud cases assigned to you for investigation
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
              My Investigation Cases
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Review and update suspicious or fraudulent transactions assigned to you.
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
                <Typography color="text.secondary">Total Assigned</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {cases.length}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">Pending</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {pendingCases}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">Under Review</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {underReviewCases}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">Confirmed Fraud</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {confirmedFraudCases}
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Card sx={{ borderRadius: 3 }}>
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
      Assigned Fraud Cases
    </Typography>

    <Typography color="text.secondary">
      Showing {filteredCases.length} of {cases.length} assigned case(s)
    </Typography>
  </Box>

  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
    <Box>
  <Typography
    variant="caption"
    color="text.secondary"
    sx={{ fontWeight: 700, display: "block", mb: 0.5 }}
  >
    Case Status
  </Typography>

  <FormControl size="small" sx={{ minWidth: 240, backgroundColor: "#ffffff" }}>
    <Select
      value={statusFilter}
      onChange={(event) => setStatusFilter(event.target.value)}
    >
      <MenuItem value="ALL">All Cases</MenuItem>
      <MenuItem value="PENDING">Pending</MenuItem>
      <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
      <MenuItem value="CONFIRMED_FRAUD">Confirmed Fraud</MenuItem>
      <MenuItem value="FALSE_POSITIVE">False Positive</MenuItem>
      <MenuItem value="RESOLVED">Resolved</MenuItem>
    </Select>
  </FormControl>
</Box>

    <Button variant="outlined" onClick={loadAssignedCases}>
      Refresh
    </Button>
  </Stack>
</Box>

              {filteredCases.length === 0 ? (
                <Typography color="text.secondary">
                    No assigned cases match the selected status.
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
                          <th style={{ padding: "12px" }}>Risk</th>
                          <th style={{ padding: "12px" }}>Prediction</th>
                          <th style={{ padding: "12px" }}>Review</th>
                          <th style={{ padding: "12px" }}>SLA</th>
                          <th style={{ padding: "12px" }}>Escalation</th>
                          <th style={{ padding: "12px" }}>Assigned At</th>
                         <th style={{ padding: "12px" }}>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedCases.map((item) => (
                          <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <td style={{ padding: "12px" }}>{item.transactionReference}</td>
                            <td style={{ padding: "12px" }}>{item.customerId}</td>
                            <td style={{ padding: "12px" }}>{item.transactionType}</td>
                            <td style={{ padding: "12px" }}>{formatCurrency(item.amount)}</td>
                            <td style={{ padding: "12px" }}>{item.riskScore}</td>

                            <td style={{ padding: "12px" }}>
                              <Chip
                                label={item.predictionLabel}
                                size="small"
                                color={getPredictionColor(item.predictionLabel)}
                              />
                            </td>

                            <td style={{ padding: "12px" }}>
                              <Chip
                                label={item.reviewStatus}
                                size="small"
                                variant="outlined"
                              />
                            </td>

                            <td style={{ padding: "12px" }}>
  <Stack spacing={0.5}>
    <Chip
      label={getSlaStatus(item).label}
      size="small"
      color={getSlaStatus(item).color}
      variant="outlined"
    />

    <Typography variant="caption" color="text.secondary">
      Due: {formatDateTime(item.slaDueAt)}
    </Typography>
  </Stack>
</td>

<td style={{ padding: "12px" }}>
  {item.escalated ? (
    <Stack spacing={0.5}>
      <Chip
        label="ESCALATED"
        size="small"
        color="error"
      />

      <Typography variant="caption" color="text.secondary">
        {formatDateTime(item.escalatedAt)}
      </Typography>
    </Stack>
  ) : (
    <Chip
      label="NOT ESCALATED"
      size="small"
      variant="outlined"
    />
  )}
</td>

                            <td style={{ padding: "12px" }}>
                              {item.assignedAt
                                ? new Date(item.assignedAt).toLocaleString()
                                : "N/A"}
                            </td>

                            <td style={{ padding: "12px" }}>
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleOpenDetails(item)}
                                >
                                Details
                                </Button>

                                <Button
                                  size="small"
                                  variant="outlined"
                                  disabled={updating}
                                  onClick={() =>
                                    handleReviewStatus(item.id, "UNDER_REVIEW")
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
                                    handleReviewStatus(item.id, "CONFIRMED_FRAUD")
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
                                    handleReviewStatus(item.id, "FALSE_POSITIVE")
                                  }
                                >
                                  False Positive
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
                    count={filteredCases.length}
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
  open={Boolean(selectedCase)}
  onClose={handleCloseDetails}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    <Typography variant="h6" fontWeight="bold">
      Assigned Case Details
    </Typography>

    <Typography variant="body2" color="text.secondary">
      Review assigned fraud case details and investigation notes
    </Typography>
  </DialogTitle>

  <DialogContent dividers>
    {selectedCase && (
      <Box>
        <Stack spacing={3}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Transaction Information
              </Typography>

              <Stack spacing={1.5}>
                <Typography>
                  <strong>Reference:</strong> {selectedCase.transactionReference}
                </Typography>

                <Typography>
                  <strong>Customer:</strong> {selectedCase.customerId}
                </Typography>

                <Typography>
                  <strong>Type:</strong> {selectedCase.transactionType}
                </Typography>

                <Typography>
                  <strong>Amount:</strong> {formatCurrency(selectedCase.amount)}
                </Typography>

                <Typography>
                  <strong>Old Balance:</strong>{" "}
                  {formatCurrency(selectedCase.oldBalance)}
                </Typography>

                <Typography>
                  <strong>New Balance:</strong>{" "}
                  {formatCurrency(selectedCase.newBalance)}
                </Typography>

                <Typography>
                  <strong>Destination Account:</strong>{" "}
                  {selectedCase.destinationAccount || "N/A"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Fraud Risk Summary
              </Typography>

              <Stack spacing={1.5}>
                <Typography>
                  <strong>Risk Score:</strong> {selectedCase.riskScore}
                </Typography>

                <Box>
                  <Typography component="span" fontWeight="bold">
                    Prediction:{" "}
                  </Typography>
                  <Chip
                    label={selectedCase.predictionLabel}
                    size="small"
                    color={getPredictionColor(selectedCase.predictionLabel)}
                  />
                </Box>

                <Box>
                  <Typography component="span" fontWeight="bold">
                    Review Status:{" "}
                  </Typography>
                  <Chip
                    label={selectedCase.reviewStatus}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Typography>
                  <strong>Assigned Analyst:</strong>{" "}
                  {selectedCase.assignedAnalystName || "N/A"}{" "}
                  {selectedCase.assignedAnalystEmail
                    ? `(${selectedCase.assignedAnalystEmail})`
                    : ""}
                </Typography>

                <Typography>
                  <strong>Assigned At:</strong>{" "}
                  {selectedCase.assignedAt
                    ? new Date(selectedCase.assignedAt).toLocaleString()
                    : "N/A"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
  <CardContent>
    <Typography variant="h6" fontWeight="bold" mb={2}>
      SLA and Escalation Status
    </Typography>

    <Stack spacing={1.5}>
      <Box>
        <Typography component="span" fontWeight="bold">
          SLA Status:{" "}
        </Typography>

        <Chip
          label={getSlaStatus(selectedCase).label}
          color={getSlaStatus(selectedCase).color}
          size="small"
          variant="outlined"
        />
      </Box>

      <Typography>
        <strong>SLA Due At:</strong> {formatDateTime(selectedCase.slaDueAt)}
      </Typography>

      <Box>
        <Typography component="span" fontWeight="bold">
          Escalation:{" "}
        </Typography>

        {selectedCase.escalated ? (
          <Chip label="ESCALATED" color="error" size="small" />
        ) : (
          <Chip label="NOT ESCALATED" size="small" variant="outlined" />
        )}
      </Box>

      {selectedCase.escalated && (
        <>
          <Typography>
            <strong>Escalated By:</strong>{" "}
            {selectedCase.escalatedBy || "N/A"}
          </Typography>

          <Typography>
            <strong>Escalated At:</strong>{" "}
            {formatDateTime(selectedCase.escalatedAt)}
          </Typography>

          <Alert severity="warning">
            {selectedCase.escalationReason || "No escalation reason provided."}
          </Alert>
        </>
      )}
    </Stack>
  </CardContent>
</Card>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Investigation Notes
              </Typography>

              <Box mb={3}>
                <TextField
                  label="Add investigation note"
                  multiline
                  minRows={3}
                  fullWidth
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  placeholder="Example: Customer contacted. Transaction requires further verification."
                />

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleAddInvestigationNote}
                  disabled={savingNote}
                >
                  {savingNote ? "Saving Note..." : "Add Note"}
                </Button>
              </Box>

              {loadingNotes ? (
                <Typography color="text.secondary">Loading notes...</Typography>
              ) : investigationNotes.length === 0 ? (
                <Typography color="text.secondary">
                  No investigation notes added yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {investigationNotes.map((note) => (
                    <Card key={note.id} variant="outlined">
                      <CardContent>
                        <Typography>{note.note}</Typography>

                        <Typography variant="caption" color="text.secondary">
                          Added by {note.createdBy} on{" "}
                          {new Date(note.createdAt).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Box>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={handleCloseDetails}>Close</Button>

    {selectedCase && (
      <>
        <Button
          variant="outlined"
          onClick={() => handleReviewStatus(selectedCase.id, "UNDER_REVIEW")}
          disabled={updating}
        >
          Mark Under Review
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() =>
            handleReviewStatus(selectedCase.id, "CONFIRMED_FRAUD")
          }
          disabled={updating}
        >
          Confirm Fraud
        </Button>

        <Button
          variant="outlined"
          color="success"
          onClick={() =>
            handleReviewStatus(selectedCase.id, "FALSE_POSITIVE")
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