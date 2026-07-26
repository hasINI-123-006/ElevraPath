import { useState, useRef } from "react";
import axios from "axios";

import {
  UploadCloud,
  Loader2,
  FileSearch,
  FileText,
  CheckCircle2,
  XCircle,
  ClipboardList
} from "lucide-react";

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

export default function ResumeAnalyzer() {

  const [file, setFile] = useState(null);

  const [showResult, setShowResult] = useState(false);

  const [jobRole, setJobRole] = useState("");

  const [error, setError] = useState("");

  const [jobDescription, setJobDescription] = useState("");

  const [analysisResult, setAnalysisResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleAnalyze = async () => {

    if (!file) {
      setError("Please upload your resume");
      return;
    }

    if (!jobRole.trim()) {
      setError("Enter a job role");
      return;
    }

    try {

      setLoading(true);

      setError("");
      const loggedInUser = JSON.parse(
          localStorage.getItem("loggedInUser")
      );

      const formData = new FormData();

      formData.append("file", file);

      formData.append("jobRole", jobRole);

      formData.append("jobDescription", jobDescription);
      formData.append("userId", loggedInUser.id);

      const response = await axios.post(
        "http://localhost:8080/analyze-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      setAnalysisResult(response.data);

      setShowResult(true);

    } catch (error) {

      console.error(error);

      setError("Failed to analyze resume");

    } finally {

      setLoading(false);
    }
  };

  const chartData = analysisResult
    ? {
        labels: ["ATS Score", "Skills Match"],
        datasets: [
          {
            label: "Score",
            data: [
              analysisResult.atsScore,
              analysisResult.skillsMatchPercentage
            ],
            backgroundColor: [
              "rgba(79,70,229,0.8)",
              "rgba(139,92,246,0.8)"
            ],
            borderRadius: 10,
          },
        ],
      }
    : null;

  const getScoreColor = (score) => {

    if (score >= 75) {
      return "text-green-600";
    }

    if (score >= 50) {
      return "text-yellow-500";
    }

    return "text-red-500";
  };

  return (
      <div className="flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-120px)]">


      {/* LEFT PANEL */}

      <div
      className="
      w-full
      lg:w-[300px]
      flex-shrink-0
      lg:sticky
      lg:top-0
      self-start
      "
      >

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 space-y-3 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">

          <div>

            <h2 className="text-lg font-bold text-gray-800">
              AI Resume Analyzer
            </h2>
          </div>

          {/* UPLOAD */}

          {!file ? (

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 min-h-[200px] flex flex-col justify-center items-center ">

              <UploadCloud
                className="mx-auto mb-5 text-indigo-500"
                size={52}
              />

              <p className="font-semibold text-gray-700 text-lg">
                Drag & Drop Resume
              </p>

              <p className="text-sm text-gray-400 mt-2 mb-5">
                PDF format supported
              </p>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition"
              >
                Choose Resume
              </button>

            </div>

          ) : (

            <div
              className="
                bg-indigo-50
                border
                border-indigo-100
                rounded-2xl
                h-[200px]
                p-6
                flex
                flex-col
                justify-between
              "
            >

              <div className="flex items-start gap-3">

                <div className="bg-white p-2 rounded-lg shadow-sm">

                  <FileText
                    size={20}
                    className="text-indigo-600"
                  />

                </div>

                <div className="flex-1">

                  <div className="flex items-center gap-2 mb-1">

                    <CheckCircle2
                      size={16}
                      className="text-green-500"
                    />

                    <p className="text-sm font-semibold text-gray-800">
                      Resume Uploaded
                    </p>

                  </div>

                  <p className="text-sm text-indigo-700 break-all">
                    {file.name}
                  </p>

                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="mt-3 text-sm text-indigo-600 hover:underline"
                  >
                    Change Resume
                  </button>

                </div>

              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />

            </div>
          )}

          {/* JOB ROLE */}

          <div>

            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Target Job Role
            </label>

            <input
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g Backend Developer"
              className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />

          </div>

          {/* JOB DESCRIPTION */}

          <div>

            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Job Description (Optional)
            </label>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description..."
              className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              rows="4"
            />

          </div>

          {/* ERROR */}

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}


          {/* BUTTON */}
          <div className="mt-6">
          <button
            onClick={handleAnalyze}
            className="w-full text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition "
          >

            {loading ? (

              <div className="flex items-center justify-center gap-2">

                <Loader2
                  className="animate-spin"
                  size={18}
                />

                AI Analyzing Resume...

              </div>

            ) : (
              "Analyze Resume"
            )}

          </button>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}


      <div
      className="
      flex-1
      w-full
      lg:overflow-y-auto
      lg:pr-2
      "
      >

        <h3 className="text-xl font-semibold text-gray-800">
          Resume Analysis
        </h3>
        <p className="text-sm text-gray-500 mt-1">
            AI-powered ATS evaluation and recruiter feedback
        </p>

        {!showResult ? (

          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <FileSearch
                size={30}
                className="text-indigo-600"
              />
            </div>

            <h4 className="text-lg font-semibold text-gray-800">
              No Analysis Yet
            </h4>

            <p className="text-sm text-gray-500 mt-2">
              Upload a resume and analyze it to see ATS score,
              strengths, weaknesses and recruiter feedback.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {/* TOP DASHBOARD */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

                {/* ATS Circle */}

                <div className="
                      bg-white
                      border
                      border-gray-200
                      rounded-2xl
                      px-6
                      py-5
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      min-h-[170px]
                      shadow-sm
                      ">

                    <div className="relative w-28 h-28">

                        <svg
                            className="w-28 h-28 -rotate-90"
                        >

                            <circle
                                cx="56"
                                cy="56"
                                r="46"
                                stroke="#E5E7EB"
                                strokeWidth="8"
                                fill="none"
                            />

                            <circle
                                cx="56"
                                cy="56"
                                r="46"
                                stroke="#4F46E5"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={289}
                                strokeDashoffset={
                                    289 -
                                    (289 * analysisResult?.atsScore) / 100
                                }
                                strokeLinecap="round"
                            />

                        </svg>

                        <div className="absolute inset-0 flex items-center justify-center">

                            <span className="text-3xl font-bold text-gray-800">

                                {analysisResult?.atsScore}%

                            </span>



                        </div>
                         <span className="text-sm text-gray-500 mt-1">
                             ATS Compatibility
                         </span>

                    </div>

                </div>

                {/* Keyword Match */}

                <div className="
                     bg-white
                     border
                     border-gray-200
                     rounded-2xl
                     px-6
                     py-5
                     flex
                     flex-col
                     justify-center
                     min-h-[170px]
                     shadow-sm
                     hover:shadow-md
                     transition
                     ">

                    <p className="text-xs uppercase tracking-wide text-gray-500">
                    Keyword Match
                    </p>

                    <h2 className="text-4xl font-bold text-indigo-600 mt-3">
                    {analysisResult?.keywordMatchPercentage}%
                    </h2>

                    <p className="text-sm mt-2 text-gray-500">
                    {
                    analysisResult?.keywordMatchPercentage >= 80
                    ? "Excellent Coverage"
                    : analysisResult?.keywordMatchPercentage >= 65
                    ? "Good Coverage"
                    : analysisResult?.keywordMatchPercentage >= 50
                    ? "Average Coverage"
                    : "Low Coverage"
                    }
                    </p>

                </div>

                {/* Skills Match */}

                <div className="
                     bg-white
                     border
                     border-gray-200
                     rounded-2xl
                     px-6
                     py-5
                     flex
                     flex-col
                     justify-center
                     min-h-[170px]
                     shadow-sm
                     hover:shadow-md
                     transition
                     ">

                    <p className="text-xs uppercase tracking-wide text-gray-500">
                    Match Quality
                    </p>

                    <h2 className="text-4xl font-bold text-indigo-600 mt-3">
                    {analysisResult?.skillsMatchPercentage}%
                    </h2>

                    <p className="text-sm mt-2 text-gray-500">
                    {
                    analysisResult?.skillsMatchPercentage >= 80
                    ? "Excellent"
                    : analysisResult?.skillsMatchPercentage >= 65
                    ? "Good"
                    : analysisResult?.skillsMatchPercentage >= 50
                    ? "Average"
                    : "Needs Improvement"
                    }
                    </p>

                </div>
            </div>

            {/* SUMMARY */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6">

              <h4 className="text-xl font-semibold text-gray-800 mb-5">
                  Summary
              </h4>

              <p className="text-gray-600 leading-7 lg:leading-8 text-[15px]">
                {analysisResult?.resumeSummary}
              </p>

            </div>

            {/* STRENGTHS + WEAKNESSES */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              <div className="bg-white border border-gray-200 rounded-2xl p-6 min-h-[260px]">

                <h4 className="text-lg font-semibold text-green-600 mb-4">
                  Strengths
                </h4>

                <ul className="space-y-4">

                    {analysisResult?.strengths?.map((item, index) => (

                        <li
                            key={index}
                            className="flex gap-3 items-start"
                        >

                            <CheckCircle2
                                className="text-green-500 mt-1"
                                size={18}
                            />

                            <span className="text-gray-700 leading-6">

                                {item}

                            </span>

                        </li>

                    ))}

                </ul>

              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 min-h-[260px]">

                <h4 className="text-lg font-semibold text-red-500 mb-4">
                  Areas to Improve
                </h4>

                <ul className="space-y-3">

                  {analysisResult?.weaknesses?.map((item, index) => (

                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700"
                    >

                      <XCircle
                          className="text-red-500 mt-1"
                          size={18}
                      />

                      <span>{item}</span>

                    </li>

                  ))}

                </ul>

              </div>

            </div>

            {/* TOP SKILLS + MISSING SKILLS */}

            <div className="grid grid-cols-2 gap-5">

                {/* Top Skills */}

                <div className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6">

                    <h4 className="text-lg font-semibold text-gray-800 mb-5">

                        Top Skills Found

                    </h4>

                    <div className="flex flex-wrap gap-2">

                        {analysisResult?.topSkills?.map((skill, index) => (

                            <span
                                key={index}
                                className="px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-100 text-sm font-medium"
                            >

                                {skill}

                            </span>

                        ))}

                    </div>

                </div>

                {/* Missing Skills */}

                <div className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6">

                    <h4 className="text-lg font-semibold text-gray-800 mb-5">

                        Missing Important Skills

                    </h4>

                    <div className="flex flex-wrap gap-2">

                        {analysisResult?.missingSkills?.map((skill, index) => (

                            <span
                                key={index}
                                className="px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm font-medium"
                            >

                                {skill}

                            </span>

                        ))}

                    </div>

                </div>

            </div>
            {/* RESUME INSIGHTS */}

            <div className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6">

                <h4 className="text-lg font-semibold text-gray-800 mb-5">

                    Resume Insights

                </h4>

                <div className="space-y-4">

                    {analysisResult?.resumeInsights?.map((item, index) => (

                        <div
                            key={index}
                            className="flex items-start gap-3"
                        >

                            <span className="text-indigo-500 mt-1 text-lg">

                                💡

                            </span>

                            <span className="text-gray-700 leading-7">

                                {item}

                            </span>

                        </div>

                    ))}

                </div>

            </div>
            {/* RECRUITER CHECKLIST */}

            <div className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6">

                <h4 className="text-lg font-semibold text-gray-800 mb-5">

                    Recruiter Checklist

                </h4>

                <div className="space-y-4">

                    {analysisResult?.checklist?.map((item, index) => (

                        <div
                            key={index}
                            className="flex justify-between items-center"
                        >

                            <span className="text-gray-700">

                                {item.item}

                            </span>

                            <span
                                className={`font-medium ${
                                    item.status === "Present"
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >

                                {item.status === "Present"
                                    ? "✔ Present"
                                    : "✖ Missing"}

                            </span>

                        </div>

                    ))}

                </div>

            </div>

            {/* RECOMMENDATIONS */}

            <div className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6">

                <h4 className="text-lg font-semibold text-gray-800 mb-5">

                    Recommendations

                </h4>

                <div className="space-y-4">

                    {analysisResult?.suggestions?.map((item, index) => (

                        <div
                            key={index}
                            className="flex justify-between items-center border-b border-gray-100 pb-3"
                        >

                            <span className="text-gray-700">

                                {item.text}

                            </span>

                            <span
                                className={`
                                    px-3 py-1 rounded-full text-xs font-medium
                                    ${
                                        item.priority === "High"
                                            ? "bg-red-100 text-red-600"
                                            : item.priority === "Medium"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700"
                                    }
                                `}
                            >

                                {item.priority}

                            </span>

                        </div>

                    ))}

                </div>

            </div>

            {/* AI Recruiter Tip */}

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">

                <div className="flex gap-4">

                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">

                        💡

                    </div>

                    <div>

                        <h4 className="text-lg font-semibold text-gray-800">

                            AI Recruiter Tip

                        </h4>

                        <p className="text-gray-600 mt-2 leading-7">

                            {analysisResult?.recruiterTip}

                        </p>

                    </div>

                </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

