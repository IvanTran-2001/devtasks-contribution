import { Link } from "react-router-dom";

const Base64Url = () => {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Base64 / URL Encoder & Decoder</h1>
      <p>This is a placeholder page for Base64 string encoding/decoding and URL query escaping.</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/devutilities">← Back to Workspace</Link>
      </div>
    </div>
  );
};

export default Base64Url;
