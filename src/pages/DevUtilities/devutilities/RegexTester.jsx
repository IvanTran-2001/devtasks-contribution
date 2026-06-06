import { Link } from "react-router-dom";

const RegexTester = () => {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Regex Tester</h1>
      <p>This is a placeholder page for regular expression testing.</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/devutilities">← Back to Workspace</Link>
      </div>
    </div>
  );
};

export default RegexTester;
