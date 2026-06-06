import { Link } from "react-router-dom";

const JsonFormatter = () => {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>JSON Formatter</h1>
      <p>This is a placeholder page for JSON validation, formatting, and minification.</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/devutilities">← Back to Workspace</Link>
      </div>
    </div>
  );
};

export default JsonFormatter;
