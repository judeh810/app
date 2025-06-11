// File: App.js
import React, { useState } from "react";

// Sample data: 1000 random 20bp DNA sequences
const sequences = Array.from({ length: 1000 }, () => {
  const bases = ["A", "T", "C", "G"];
  return Array.from({ length: 20 }, () => bases[Math.floor(Math.random() * 4)]).join("");
});

function gcContent(seq) {
  const gc = (seq.match(/[GC]/g) || []).length;
  return gc / seq.length;
}

function entropy(seq) {
  const counts = [...seq].reduce((acc, base) => {
    acc[base] = (acc[base] || 0) + 1;
    return acc;
  }, {});
  return (
    -Object.values(counts)
      .map((n) => (n / seq.length) * Math.log2(n / seq.length))
      .reduce((a, b) => a + b, 0) / Math.log2(4)
  );
}

function generateCommentary(seq) {
  const comments = [];
  if (gcContent(seq) < 0.35) {
    comments.push("Low GC content; likely poor structural stability but good for open chromatin regions.");
  }
  if (seq.includes("TATAAA")) {
    comments.push("Strong core promoter potential.");
  }
  if (entropy(seq) > 0.8) {
    comments.push("Highly randomized; unlikely to appear in nature.");
  }
  return comments;
}

function App() {
  const [query, setQuery] = useState("");

  const filtered = sequences
    .filter((seq) => seq.includes(query.toUpperCase()))
    .slice(0, 100); // limit to first 100 matches for performance

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>DNA Sequence Explorer</h1>
      <input
        type="text"
        value={query}
        placeholder="Search for a motif (e.g. TATAAA)"
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "0.5rem", fontSize: "1rem", width: "100%", marginBottom: "1rem" }}
      />
      {filtered.map((seq, i) => (
        <div key={i} style={{ marginBottom: "1.5rem" }}>
          <code style={{ fontSize: "1.2rem" }}>{seq}</code>
          <ul>
            {generateCommentary(seq).map((comment, j) => (
              <li key={j}>{comment}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
