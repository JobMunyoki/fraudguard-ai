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

  useEffect(() => {
    const savedSettings = localStorage.getItem("fraudguard-settings");

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
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