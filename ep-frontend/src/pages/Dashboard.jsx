import {
  Upload,
  Bot,
  FileText,
  BarChart3,
  Star,
  ChevronDown
} from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const user = JSON.parse(localStorage.getItem("loggedInUser"));

export default function Dashboard({ setCurrentPage }) {
    const [resumeCount, setResumeCount] = useState(0);
    const [interviewCount, setInterviewCount] = useState(0);
    const [skillGapCount, setSkillGapCount] = useState(0);
    const [profileStrength, setProfileStrength] = useState(0);
    const [progressData, setProgressData] = useState([]);
    const [showChart, setShowChart] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [roles, setRoles] = useState([]);
    const [growth, setGrowth] = useState(0);
    const [progressMessage, setProgressMessage] = useState("");
    useEffect(() => {

      if (!selectedRole) return;

      axios
        .get("http://localhost:8080/ai/skill-progress", {

          params: {
            userId: user.id,
            role: selectedRole
          }

        })

        .then((res) => {
            console.log(res.data);

          const chartData = res.data.map((item, index) => ({
              id: index,
              xLabel: item.date.split(",")[1].trim(),
              fullDate: item.date,
              resumeName: item.resumeName,
              score: item.score
          }));
      console.log(chartData);

          setProgressData(chartData);
          setShowChart(chartData.length >= 3);

          // Growth %
          if (chartData.length >= 2) {

            const latest =
              chartData[chartData.length - 1].score;

            const previous =
              chartData[chartData.length - 2].score;

            const growthPercent =
              Math.round(((latest - previous) / previous) * 100);

            setGrowth(growthPercent);

            if (growthPercent > 0) {

              setProgressMessage(
                `✨ Great progress! Your ${selectedRole} resume quality improved by ${growthPercent}% since your previous analysis.`
              );

            } else if (growthPercent === 0) {

              setProgressMessage(
                `✨ Your ${selectedRole} resume quality is consistent.`
              );

            } else {

              setProgressMessage(
                `⚠️ Your latest ${selectedRole} resume scored slightly lower. Review the analysis report from history to improve it.`
              );

            }

          }
      else {

          setGrowth(0);

          setProgressMessage(
              `✨ This is your first ${selectedRole} resume analysis. Upload another resume for this role to start tracking your progress.`
          );

      }

        });

    }, [selectedRole]);
    useEffect(() => {

        if (!user) return;

        axios.get("http://localhost:8080/ai/resume-count", {
            params: {
                userId: user.id,
            },
        })
            .then((res) => {

                setResumeCount(res.data);

            })
            .catch((err) => {

                console.error(err);

            });
        axios
            .get("http://localhost:8080/ai/interview-count", {
                params: {
                    userId: user.id,
                },
            })
            .then((res) => {
                setInterviewCount(res.data);
            });

        axios
            .get(`http://localhost:8080/ai/skill-gap-count/${user.id}`)
            .then((response) => {
                setSkillGapCount(response.data.skillGapCount);
            })
            .catch((error) => {
                console.error(error);
            });
        axios
            .get(`http://localhost:8080/ai/profile-strength/${user.id}`)
            .then((response) => {
                setProfileStrength(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        axios
          .get(`http://localhost:8080/ai/roles/${user.id}`)
          .then((res) => {

            setRoles(res.data);

            const savedRole = sessionStorage.getItem("selectedSkillRole");

            if (
                savedRole &&
                res.data.includes(savedRole)
            ) {

                setSelectedRole(savedRole);

            } else if (res.data.length > 0) {

                setSelectedRole(res.data[0]);

            }

          });

    }, []);
const latest =
  progressData.length > 0
    ? progressData[progressData.length - 1]
    : null;

const previous =
  progressData.length > 1
    ? progressData[progressData.length - 2]
    : null;

  return (
    <div className="space-y-8 animate-fadeIn">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* LEFT */}
        <div>
          <p className="text-sm text-gray-500 mb-2">

            Welcome back, {user?.name}! 👋
          </p>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
            AI-Powered Interview & <br />
            Skill Gap Analyzer
          </h1>


          <p className="text-gray-500 mt-4">
            Upload your resume, get AI insights, identify skill gaps,
            and practice interviews to land your dream job.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-row sm:flex-row gap-4 mt-6">

              <button
                  onClick={() => setCurrentPage("resume")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow transition"
              >
                  Upload Resume
              </button>

              <button
                  onClick={() => setCurrentPage("interview")}
                  className="border px-6 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                  Try AI Interviewer
              </button>

          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4 transition duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="w-20 h-20 rounded-full border-4 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center text-xl font-bold text-green-500">
            {profileStrength}%
          </div>

          <div>
            <p className="text-gray-500 text-sm">Overall Score</p>
            <p className="font-semibold">Your Profile Strength</p>
          </div>
        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <StatCard
          icon={<FileText />}
          value={resumeCount}
          label="Resumes Analyzed"
        />

        <StatCard
          icon={<Bot />}
          value={interviewCount}
          label="Interviews Taken"
        />

        <StatCard
          icon={<BarChart3 />}
          value={skillGapCount}
          label="Skill Gaps Found"
        />



      </div>

      {/* SKILL PROGRESS GRAPH */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">

          {/* LEFT */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <BarChart3 size={18} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Skill Progress Tracker
              </h2>

              <p className="text-sm text-gray-500">
                Track improvement across resume analyses
              </p>
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            <select
                value={selectedRole}
                onChange={(e) => {

                    setSelectedRole(e.target.value);

                    sessionStorage.setItem(
                        "selectedSkillRole",
                        e.target.value
                    );

                }}
               className="border rounded-lg px-3 py-2 text-sm w-44 sm:w-auto"
            >

                {roles.map((role) => (

                    <option
                        key={role}
                        value={role}
                    >
                        {role}
                    </option>

                ))}

            </select>

            <div
            className={`px-3 py-2 rounded-lg font-semibold text-sm ${
                growth>=0
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
            >

            {growth>=0?"+":""}
            {growth}% Growth

            </div>

          </div>

        </div>

        {/* GRAPH */}
        {showChart ? (
        <div className="h-[280px]">
          {progressData.length === 0 ? (

          <div className="h-full flex items-center justify-center text-gray-400">

          No resume analyses found for this role.

          </div>

          ) : (
          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={progressData}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                  dataKey="xLabel"
                  tickFormatter={(value, index) => `Resume ${index + 1}`}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                      fill: "#6b7280",
                      fontSize: 12
                  }}
              />

              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#6b7280",
                  fontSize: 12
                }}
                width={35}
              />

              <Tooltip
                content={({ active, payload }) => {

                  if (!active || !payload || !payload.length) return null;

                  const item = payload[0].payload;

                  return (
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72">

                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">

                        <div>



                          <h3 className="font-semibold text-gray-800 truncate">
                            {item.resumeName}
                          </h3>

                        </div>



                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        🕒 {item.fullDate}
                      </div>

                      <div>

                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Resume Quality</span>
                          <span>{item.score}%</span>
                        </div>

                        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                            style={{
                              width: `${item.score}%`
                            }}
                          />

                        </div>

                      </div>

                    </div>
                  );

                }}
              />

              <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#5b34ff"
                  strokeWidth={3}
                  dot={{
                      r: 5,
                      strokeWidth: 2,
                      fill: "#5b34ff",
                      stroke: "#fff"
                  }}
                  activeDot={{
                      r: 7
                  }}
                  name="Resume Quality"
              />

            </LineChart>

          </ResponsiveContainer>
          )}

        </div>
        ) : (

            <div className="h-[280px] flex items-center justify-center">

                <div className="w-full bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-3 sm:p-6 lg:p-8 ...">

                    <div className="flex justify-between items-center mb-6">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Latest Resume Quality
                            </p>

                            <h2 className="hidden sm:block text-5xl font-bold text-indigo-600 mt-2">
                              {latest?.score ?? 0}%
                            </h2>

                        </div>

                        {previous && (

                            <div
                                className={`px-5 py-3 rounded-xl font-semibold text-lg ${
                                    growth >= 0
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {growth >= 0 ? "▲" : "▼"} {Math.abs(growth)}%
                            </div>

                        )}

                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-6">

                        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-2 sm:p-5">

                            <p className="text-gray-500 text-sm">
                                Previous
                            </p>

                            <p className="text-2xl font-bold text-gray-700">
                                {previous ? `${previous.score}%` : "--"}
                            </p>

                        </div>

                        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-2 sm:p-5">

                            <p className="text-gray-500 text-sm">
                                Current
                            </p>

                            <p className="text-2xl font-bold text-indigo-600">
                                {latest?.score ?? 0}%
                            </p>

                        </div>


                    </div>

                    <div className="mt-4 text-gray-600 text-xs sm:text-sm leading-6">

                        {previous ? (
                            growth >= 0 ? (
                                <>
                                    🎉 Your resume quality improved by{" "}
                                    <span className="font-semibold text-green-600">
                                        {growth}%
                                    </span>{" "}
                                    since your previous analysis.
                                </>
                            ) : (
                                <>
                                    Resume quality decreased by{" "}
                                    <span className="font-semibold text-red-600">
                                        {Math.abs(growth)}%
                                    </span>
                                    . Review the latest suggestions.
                                </>
                            )
                        ) : (
                            <>
                                Upload another resume for this role to start tracking your progress.
                            </>
                        )}

                    </div>



                </div>

            </div>

        )}

        {/* BOTTOM MESSAGE */}
        <div className="mt-4 text-gray-600 text-xs sm:text-sm leading-5 break-words">


          <p className="text-sm text-gray-700 break-words">
            {progressMessage}
          </p>

        </div>

      </div>

      <div>

        {/* HEADING */}
        <div className="mb-3">

          <h2 className="text-lg font-semibold text-gray-800">
            How It Works
          </h2>

        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          <StepCard
            number="1"
            title="Upload Resume"
            desc="Upload your PDF resume securely."
          />

          <StepCard
            number="2"
            title="Resume Analysis"
            desc="AI analyzes skills, projects and keywords."
          />

          <StepCard
            number="3"
            title="Skill Gap Detection"
            desc="Identify missing skills for target roles."
          />

          <StepCard
            number="4"
            title="AI Mock Interview"
            desc="Practice interviews with AI feedback."
          />

          <StepCard
            number="5"
            title="Track Growth"
            desc="Monitor progress and score improvements."
          />

        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm transition duration-300 hover:shadow-md hover:-translate-y-1">

      <div className="bg-indigo-100 w-fit p-3 rounded-lg text-indigo-600 mb-3">
        {icon}
      </div>

      <div>
        <h3 className="text-lg font-bold">{value}</h3>
        <p className="text-sm text-gray-500">{label}</p>
      </div>

    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm transition duration-300 hover:shadow-md hover:-translate-y-1" >

      <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full mb-3">
        {number}
      </div>

      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 leading-5">{desc}</p>

    </div>
  );
}

function ProgressCard({ icon, percentage, label }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm transition duration-300 hover:shadow-md hover:-translate-y-1">

      {/* TOP */}
      <div className="flex items-center gap-3 mb-3">

        <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
          {icon}
        </div>

        <p className="text-sm text-gray-500">{label}</p>

      </div>

      {/* PERCENT */}
      <h3 className="text-xl font-bold text-indigo-600 mb-2">
        {percentage}%
      </h3>

      {/* PROGRESS BAR */}
      <div className="w-full h-2 bg-gray-200 rounded-full">

        <div
          className="h-2 bg-indigo-600 rounded-full transition-all duration-700"
          style={{ width: `${percentage}%` }}
        ></div>

      </div>

    </div>
  );
}

