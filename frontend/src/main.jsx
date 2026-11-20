import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import App from "./App";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("ErrorBoundary", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "monospace", background: "#fff0f0", minHeight: "100vh" }}>
            <h2 style={{ color: "#c0392b" }}>The application could not be loaded.</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#fff", padding: 12, border: "1px solid #e74c3c", borderRadius: 8 }}>{String(this.state.error?.stack || this.state.error)}</pre>
          <button onClick={() => { localStorage.clear(); location.reload(); }} style={{ marginTop: 12, padding: "8px 12px", background: "#c0392b", color: "#fff", border: 0, borderRadius: 6 }}>Clear saved data and reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary><App /></ErrorBoundary>
  </StrictMode>,
);