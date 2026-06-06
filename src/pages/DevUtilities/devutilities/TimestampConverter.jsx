import { Link } from "react-router-dom";

const TimestampConverter = () => {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Timestamp Converter</h1>
      <p>This is a placeholder page for Unix/Epoch timestamp parsing and Date conversions.</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/devutilities">← Back to Workspace</Link>
      </div>
    </div>
  );
};

export default TimestampConverter;
