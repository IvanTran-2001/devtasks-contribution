import { Link } from "react-router-dom";

const DeleteHistory = () => {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Resource Delete History</h1>
      <p>This is a placeholder page containing deleted resource bookmarks.</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/resourcehub">← Back to Workspace</Link>
      </div>
    </div>
  );
};

export default DeleteHistory;
