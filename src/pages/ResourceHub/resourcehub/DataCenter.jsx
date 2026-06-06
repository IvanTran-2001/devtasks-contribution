import { Link } from "react-router-dom";

const DataCenter = () => {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Resource Data Center</h1>
      <p>This is a placeholder page to export or import resource index JSON files.</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/resourcehub">← Back to Workspace</Link>
      </div>
    </div>
  );
};

export default DataCenter;
