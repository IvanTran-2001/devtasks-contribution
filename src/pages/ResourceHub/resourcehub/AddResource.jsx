import { Link } from "react-router-dom";

const AddResource = () => {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Add Resource</h1>
      <p>This is a placeholder page to add new resources to the database.</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/resourcehub">← Back to Workspace</Link>
      </div>
    </div>
  );
};

export default AddResource;
