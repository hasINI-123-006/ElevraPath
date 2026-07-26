import { useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Analysis() {

  const [jobRole, setJobRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);

  // Chart data
  const chartData = result ? {
    labels: Object.keys(result.skillScores),
    datasets: [
      {
        label: "Skill Level",
        data: Object.values(result.skillScores),
      }
    ]
  } : null;

  return (
    <div className="bg-gray-100 min-h-full">

      <h2 className="text-2xl font-bold mb-6">Resume Analysis</h2>

      {/* INPUT */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 max-w-xl">

        <input
          placeholder="Job Role"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          placeholder="Job Description (optional)"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <button
          onClick={handleAnalyze}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Analyze
        </button>

      </div>

      {/* RESULTS */}
      {result && (
        <div className="grid grid-cols-2 gap-6">

          {/* Skills */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">Your Skills</h3>
            <ul className="list-disc ml-5 text-green-600">
              {result.skills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          {/* Missing */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">Missing Skills</h3>
            <ul className="list-disc ml-5 text-red-500">
              {result.missing.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md col-span-2">

            <h3 className="text-lg font-semibold mb-4">Skill Analysis</h3>

            <div className="h-64">  {/* 🔥 FIX HEIGHT */}
              {chartData && (
                <Bar
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                  }}
                />
              )}
            </div>

          </div>
          {/* Roadmap */}
          <div className="bg-white p-6 rounded-2xl shadow-md col-span-2">
            <h3 className="text-lg font-semibold mb-3">Learning Roadmap</h3>
            <ul className="list-decimal ml-5 text-gray-700">
              {result.roadmap.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}