import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axiosConfig";
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
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Snackbar,
  Stack,
  Switch,
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
  Save,
  Security,
  Settings,
  Shield,
  SmartToy,
} from "@mui/icons-material";

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

const defaultSettings = {
  analystName: "Job Munyoki",
  analystRole: "Fraud Analyst",
  organizationName: "FraudGuard AI Bank",
  riskThreshold: 70,
  criticalRiskThreshold: 90,
  notificationMode: "Dashboard Only",
  enableEmailAlerts: false,
  enableCriticalAlerts: true,
  enableAuditLogging: true,
  modelMode: "Rule-Based Scoring",
  sessionTimeout: 30,
};

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

function SectionHeader({ icon, title, subtitle }) {
  return (
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: "#eff6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#2563eb",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>

        <Typography color="text.secondary">{subtitle}</Typography>
      </Box>
    </Box>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [successMessage, setSuccessMessage] = useState("");

  const [slaSettings, setSlaSettings] = useState({
  criticalRiskThreshold: 90,
  highRiskThreshold: 70,
  mediumRiskThreshold: 40,
  criticalRiskSlaHours: 4,
  highRiskSlaHours: 12,
  mediumRiskSlaHours: 24,
  lowRiskSlaHours: 48,
});

const [slaLoading, setSlaLoading] = useState(false);
const [slaSaving, setSlaSaving] = useState(false);
const [slaError, setSlaError] = useState("");
const [slaSuccess, setSlaSuccess] = useState("");
const [slaUpdatedBy, setSlaUpdatedBy] = useState("");
const [slaUpdatedAt, setSlaUpdatedAt] = useState("");

  useEffect(() => {
    const savedSettings = localStorage.getItem("fraudguard-settings");

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    loadSlaSettings();
  }, []);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setSettings((previousSettings) => ({
      ...previousSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSliderChange(name, value) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [name]: value,
    }));
  }

  function handleSaveSettings() {
    localStorage.setItem("fraudguard-settings", JSON.stringify(settings));
    setSuccessMessage("Settings saved successfully.");
  }

  function handleResetSettings() {
    setSettings(defaultSettings);
    localStorage.setItem("fraudguard-settings", JSON.stringify(defaultSettings));
    setSuccessMessage("Settings reset to default values.");
  }

  async function loadSlaSettings() {
  try {
    setSlaLoading(true);
    setSlaError("");

    const response = await api.get("/sla-settings");

    setSlaSettings({
      criticalRiskThreshold: response.data.criticalRiskThreshold ?? 90,
      highRiskThreshold: response.data.highRiskThreshold ?? 70,
      mediumRiskThreshold: response.data.mediumRiskThreshold ?? 40,
      criticalRiskSlaHours: response.data.criticalRiskSlaHours ?? 4,
      highRiskSlaHours: response.data.highRiskSlaHours ?? 12,
      mediumRiskSlaHours: response.data.mediumRiskSlaHours ?? 24,
      lowRiskSlaHours: response.data.lowRiskSlaHours ?? 48,
    });

    setSlaUpdatedBy(response.data.updatedBy || "Not updated yet");
    setSlaUpdatedAt(
      response.data.updatedAt
        ? new Date(response.data.updatedAt).toLocaleString()
        : "N/A"
    );
  } catch (err) {
    console.error("SLA settings load error:", err);
    setSlaError("Failed to load SLA settings.");
  } finally {
    setSlaLoading(false);
  }
}

function handleSlaSettingChange(field, value) {
  setSlaSettings((previousSettings) => ({
    ...previousSettings,
    [field]: value === "" ? "" : Number(value),
  }));
}

function validateSlaSettings() {
  if (
    slaSettings.criticalRiskThreshold === "" ||
    slaSettings.highRiskThreshold === "" ||
    slaSettings.mediumRiskThreshold === "" ||
    slaSettings.criticalRiskSlaHours === "" ||
    slaSettings.highRiskSlaHours === "" ||
    slaSettings.mediumRiskSlaHours === "" ||
    slaSettings.lowRiskSlaHours === ""
  ) {
    return "All SLA fields are required.";
  }

  if (
    Number(slaSettings.criticalRiskThreshold) <=
      Number(slaSettings.highRiskThreshold) ||
    Number(slaSettings.highRiskThreshold) <=
      Number(slaSettings.mediumRiskThreshold)
  ) {
    return "Thresholds must follow this order: Critical > High > Medium.";
  }

  if (
    Number(slaSettings.criticalRiskSlaHours) <= 0 ||
    Number(slaSettings.highRiskSlaHours) <= 0 ||
    Number(slaSettings.mediumRiskSlaHours) <= 0 ||
    Number(slaSettings.lowRiskSlaHours) <= 0
  ) {
    return "SLA hours must be greater than zero.";
  }

  return "";
}

async function saveSlaSettings() {
  try {
    setSlaSaving(true);
    setSlaError("");
    setSlaSuccess("");

    const validationError = validateSlaSettings();

    if (validationError) {
      setSlaError(validationError);
      return;
    }

    const response = await api.put("/sla-settings", slaSettings);

    setSlaSettings({
      criticalRiskThreshold: response.data.criticalRiskThreshold,
      highRiskThreshold: response.data.highRiskThreshold,
      mediumRiskThreshold: response.data.mediumRiskThreshold,
      criticalRiskSlaHours: response.data.criticalRiskSlaHours,
      highRiskSlaHours: response.data.highRiskSlaHours,
      mediumRiskSlaHours: response.data.mediumRiskSlaHours,
      lowRiskSlaHours: response.data.lowRiskSlaHours,
    });

    setSlaUpdatedBy(response.data.updatedBy || "N/A");
    setSlaUpdatedAt(
      response.data.updatedAt
        ? new Date(response.data.updatedAt).toLocaleString()
        : "N/A"
    );

    setSlaSuccess("SLA rules updated successfully.");
    setSuccessMessage("SLA rules updated successfully.");
  } catch (err) {
    console.error("SLA settings save error:", err);

    setSlaError(
      err.response?.data?.message ||
        "Failed to save SLA settings. Only ADMIN can update SLA rules."
    );
  } finally {
    setSlaSaving(false);
  }
}

function resetSlaDefaults() {
  setSlaSettings({
    criticalRiskThreshold: 90,
    highRiskThreshold: 70,
    mediumRiskThreshold: 40,
    criticalRiskSlaHours: 4,
    highRiskSlaHours: 12,
    mediumRiskSlaHours: 24,
    lowRiskSlaHours: 48,
  });

  setSlaSuccess("");
  setSlaError("");
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
                Settings
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Manage user profile, risk thresholds, alerts, and security options
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
                System Settings
              </Typography>

              <Typography color="text.secondary" mt={1}>
                Configure FraudGuard AI behavior, fraud thresholds, and analyst preferences.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleResetSettings}>
                Reset
              </Button>

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSettings}
              >
                Save Settings
              </Button>
            </Stack>
          </Box>

          <Card sx={{ borderRadius: 3, mb: 3 }}>
  <CardContent>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
      mb={2}
    >
      <Box>
        <Typography variant="h5" fontWeight="bold">
          Admin SLA Rule Settings
        </Typography>

        <Typography color="text.secondary" mt={0.5}>
          Configure how long fraud cases can remain open before they become overdue.
        </Typography>
      </Box>

      <Chip label="ADMIN ONLY" color="primary" variant="outlined" />
    </Box>

    {slaError && (
      <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSlaError("")}>
        {slaError}
      </Alert>
    )}

    {slaSuccess && (
      <Alert
        severity="success"
        sx={{ mb: 2 }}
        onClose={() => setSlaSuccess("")}
      >
        {slaSuccess}
      </Alert>
    )}

    {slaLoading ? (
      <Typography color="text.secondary">Loading SLA settings...</Typography>
    ) : (
      <>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Risk Thresholds
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            label="Critical Risk Threshold"
            type="number"
            value={slaSettings.criticalRiskThreshold}
            onChange={(event) =>
              handleSlaSettingChange(
                "criticalRiskThreshold",
                event.target.value
              )
            }
            helperText="Example: 90 means risk score 90 and above"
            fullWidth
          />

          <TextField
            label="High Risk Threshold"
            type="number"
            value={slaSettings.highRiskThreshold}
            onChange={(event) =>
              handleSlaSettingChange("highRiskThreshold", event.target.value)
            }
            helperText="Example: 70 means risk score 70 and above"
            fullWidth
          />

          <TextField
            label="Medium Risk Threshold"
            type="number"
            value={slaSettings.mediumRiskThreshold}
            onChange={(event) =>
              handleSlaSettingChange("mediumRiskThreshold", event.target.value)
            }
            helperText="Example: 40 means risk score 40 and above"
            fullWidth
          />
        </Box>

        <Typography variant="h6" fontWeight="bold" mb={2}>
          SLA Hours
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            label="Critical Risk SLA Hours"
            type="number"
            value={slaSettings.criticalRiskSlaHours}
            onChange={(event) =>
              handleSlaSettingChange("criticalRiskSlaHours", event.target.value)
            }
            fullWidth
          />

          <TextField
            label="High Risk SLA Hours"
            type="number"
            value={slaSettings.highRiskSlaHours}
            onChange={(event) =>
              handleSlaSettingChange("highRiskSlaHours", event.target.value)
            }
            fullWidth
          />

          <TextField
            label="Medium Risk SLA Hours"
            type="number"
            value={slaSettings.mediumRiskSlaHours}
            onChange={(event) =>
              handleSlaSettingChange("mediumRiskSlaHours", event.target.value)
            }
            fullWidth
          />

          <TextField
            label="Low Risk SLA Hours"
            type="number"
            value={slaSettings.lowRiskSlaHours}
            onChange={(event) =>
              handleSlaSettingChange("lowRiskSlaHours", event.target.value)
            }
            fullWidth
          />
        </Box>

        <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Current SLA Rules Preview
            </Typography>

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
                    <th style={{ padding: "12px" }}>Risk Level</th>
                    <th style={{ padding: "12px" }}>Condition</th>
                    <th style={{ padding: "12px" }}>SLA Time</th>
                  </tr>
                </thead>

                <tbody>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px" }}>
                      <Chip label="Critical" color="error" size="small" />
                    </td>
                    <td style={{ padding: "12px" }}>
                      Risk score {slaSettings.criticalRiskThreshold} and above
                    </td>
                    <td style={{ padding: "12px" }}>
                      {slaSettings.criticalRiskSlaHours} hour(s)
                    </td>
                  </tr>

                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px" }}>
                      <Chip label="High" color="warning" size="small" />
                    </td>
                    <td style={{ padding: "12px" }}>
                      Risk score {slaSettings.highRiskThreshold} to{" "}
                      {Number(slaSettings.criticalRiskThreshold) - 1}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {slaSettings.highRiskSlaHours} hour(s)
                    </td>
                  </tr>

                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px" }}>
                      <Chip label="Medium" color="primary" size="small" />
                    </td>
                    <td style={{ padding: "12px" }}>
                      Risk score {slaSettings.mediumRiskThreshold} to{" "}
                      {Number(slaSettings.highRiskThreshold) - 1}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {slaSettings.mediumRiskSlaHours} hour(s)
                    </td>
                  </tr>

                  <tr>
                    <td style={{ padding: "12px" }}>
                      <Chip label="Low" color="success" size="small" />
                    </td>
                    <td style={{ padding: "12px" }}>
                      Risk score below {slaSettings.mediumRiskThreshold}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {slaSettings.lowRiskSlaHours} hour(s)
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={saveSlaSettings}
            disabled={slaSaving}
          >
            {slaSaving ? "Saving..." : "Save SLA Rules"}
          </Button>

          <Button variant="outlined" onClick={resetSlaDefaults}>
            Reset Defaults
          </Button>

          <Button variant="outlined" onClick={loadSlaSettings}>
            Reload
          </Button>
        </Stack>

        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            Last Updated By: {slaUpdatedBy || "N/A"}
          </Typography>

          <br />

          <Typography variant="caption" color="text.secondary">
            Last Updated At: {slaUpdatedAt || "N/A"}
          </Typography>
        </Box>
      </>
    )}
  </CardContent>
</Card>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <SectionHeader
                    icon={<Shield />}
                    title="User Profile"
                    subtitle="Analyst and organization information"
                  />

                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Analyst Name"
                      name="analystName"
                      value={settings.analystName}
                      onChange={handleChange}
                    />

                    <TextField
                      fullWidth
                      label="Analyst Role"
                      name="analystRole"
                      value={settings.analystRole}
                      onChange={handleChange}
                    />

                    <TextField
                      fullWidth
                      label="Organization Name"
                      name="organizationName"
                      value={settings.organizationName}
                      onChange={handleChange}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <SectionHeader
                    icon={<SmartToy />}
                    title="AI Risk Settings"
                    subtitle="Control fraud scoring thresholds"
                  />

                  <Box mb={3}>
                    <Typography fontWeight="bold">
                      Fraud Risk Threshold: {settings.riskThreshold}
                    </Typography>

                    <Typography color="text.secondary" mb={1}>
                      Transactions above this score are treated as high risk.
                    </Typography>

                    <Slider
                      value={settings.riskThreshold}
                      min={40}
                      max={95}
                      step={5}
                      marks
                      valueLabelDisplay="auto"
                      onChange={(event, value) =>
                        handleSliderChange("riskThreshold", value)
                      }
                    />
                  </Box>

                  <Box>
                    <Typography fontWeight="bold">
                      Critical Risk Threshold: {settings.criticalRiskThreshold}
                    </Typography>

                    <Typography color="text.secondary" mb={1}>
                      Transactions above this score are treated as critical alerts.
                    </Typography>

                    <Slider
                      value={settings.criticalRiskThreshold}
                      min={70}
                      max={99}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                      onChange={(event, value) =>
                        handleSliderChange("criticalRiskThreshold", value)
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <SectionHeader
                    icon={<NotificationsActive />}
                    title="Notification Settings"
                    subtitle="Control how analysts receive fraud alerts"
                  />

                  <Stack spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>Notification Mode</InputLabel>
                      <Select
                        label="Notification Mode"
                        name="notificationMode"
                        value={settings.notificationMode}
                        onChange={handleChange}
                      >
                        <MenuItem value="Dashboard Only">Dashboard Only</MenuItem>
                        <MenuItem value="Email Alerts">Email Alerts</MenuItem>
                        <MenuItem value="Dashboard + Email">
                          Dashboard + Email
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Switch
                          name="enableEmailAlerts"
                          checked={settings.enableEmailAlerts}
                          onChange={handleChange}
                        />
                      }
                      label="Enable email alerts"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          name="enableCriticalAlerts"
                          checked={settings.enableCriticalAlerts}
                          onChange={handleChange}
                        />
                      }
                      label="Enable critical fraud alerts"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <SectionHeader
                    icon={<Security />}
                    title="Security Configuration"
                    subtitle="System access and audit settings"
                  />

                  <Stack spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>Model Mode</InputLabel>
                      <Select
                        label="Model Mode"
                        name="modelMode"
                        value={settings.modelMode}
                        onChange={handleChange}
                      >
                        <MenuItem value="Rule-Based Scoring">
                          Rule-Based Scoring
                        </MenuItem>
                        <MenuItem value="AI Model Prediction">
                          AI Model Prediction
                        </MenuItem>
                        <MenuItem value="Hybrid Mode">Hybrid Mode</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      type="number"
                      label="Session Timeout"
                      name="sessionTimeout"
                      value={settings.sessionTimeout}
                      onChange={handleChange}
                      helperText="Session timeout in minutes"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          name="enableAuditLogging"
                          checked={settings.enableAuditLogging}
                          onChange={handleChange}
                        />
                      }
                      label="Enable audit logging"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 4 }}>
            These settings are currently saved in the browser using localStorage.
            Later, we can create a Spring Boot Settings API and save them in MySQL.
          </Alert>

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