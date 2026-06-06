import { Link } from "react-router-dom";

const ListResources = () => {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Resource List</h1>
      <p>This is a placeholder page listing all active saved resource bookmarks.</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/resourcehub">← Back to Workspace</Link>
      </div>
    </div>
  );
};

export default ListResources;
