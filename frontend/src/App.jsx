import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import FraudAlerts from "./pages/FraudAlerts";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import AuditLogs from "./pages/AuditLogs";
import Login from "./pages/Login";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("fraudguard_token");
  const role = localStorage.getItem("fraudguard_role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "FRAUD_ANALYST", "VIEWER"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "FRAUD_ANALYST"]}>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fraud-alerts"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "FRAUD_ANALYST"]}>
              <FraudAlerts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "FRAUD_ANALYST", "VIEWER"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;