import { useState, useEffect } from "react";
import API, { API_BASE_URL } from "../api";

    export default function History({

        setSelectedInterviewId,

        setSelectedResumeId,

        setCurrentPage

    }) {

  const [activeTab, setActiveTab] = useState("interview");
  const [openMenu, setOpenMenu] = useState(null);

  const [interviewHistory, setInterviewHistory] = useState([]);
  const [resumeHistory, setResumeHistory] = useState([]);
  useEffect(() => {

      loadInterviewHistory();
      loadResumeHistory();

  }, []);


  const loadInterviewHistory = async () => {

    try {

      const response =
        await API.get(
          "/ai/history"
        );



      setInterviewHistory(response.data);

    } catch (error) {

      console.error(error);

    }

  };
  const loadResumeHistory = async () => {

      try {

          const loggedInUser = JSON.parse(
                      localStorage.getItem("loggedInUser")
                  );

                  const response = await API.get(
                      `/ai/resume-history/user/${loggedInUser.id}`
                  );

          setResumeHistory(response.data);

      } catch (error) {

          console.error(error);

      }

  };
  const deleteInterview = async (id) => {

    try {

      await API.delete(
        `/ai/history/${id}`
      );

      loadInterviewHistory();

    } catch (error) {

      console.error(error);

    }

  };
  const deleteResume = async (id) => {

      try {

          await API.delete(
              `/ai/resume/history/${id}`
          );

          loadResumeHistory();

      } catch (error) {

          console.error(error);

      }

  };
  const downloadResume = async (id) => {

      try {

          const response = await API.get(

              `/ai/resume/download/${id}`,

              {
                  responseType: "blob"
              }

          );

          const url = window.URL.createObjectURL(
              new Blob([response.data])
          );

          const link = document.createElement("a");

          link.href = url;

          const disposition =
              response.headers["content-disposition"];

          let filename = "Resume_Report.pdf";

          if (disposition) {

              const match =
                  disposition.match(/filename="?(.+?)"?$/);

              if (match) {

                  filename = match[1];

              }

          }

          link.setAttribute(
              "download",
              filename
          );

          document.body.appendChild(link);

          link.click();

          link.remove();

      }

      catch (error) {

          console.error(error);

      }

  };

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          History
        </h1>
        <p className="text-sm text-gray-500">
          Track your past interviews and resume analyses
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("interview")}
          className={`pb-2 text-sm font-medium ${
            activeTab === "interview"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500"
          }`}
        >
          Interview History
        </button>

        <button
          onClick={() => setActiveTab("resume")}
          className={`pb-2 text-sm font-medium ${
            activeTab === "resume"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500"
          }`}
        >
          Resume Analysis
        </button>
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* INTERVIEW TAB */}
        {activeTab === "interview" &&
          (interviewHistory.length === 0 ? (
            <EmptyState text="No interviews yet" />
          ) : (
            interviewHistory.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >

                <div className="flex justify-between items-start">
                    <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.role}
                  </h3>
                  {item.resumeUsed && (
                              <p className="text-xs text-gray-400 mt-1">
                                  {item.resumeName}
                              </p>
                          )}

                                      <p className="text-xs text-gray-400 mt-1">
                                          {new Date(item.completedAt)
                                              .toLocaleString("en-GB", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  hour12: true,
                                              })
                                              .replace("AM", "am")
                                              .replace("PM", "pm")}
                                      </p>
                             </div>

                      <div className="relative">

                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === item.id
                                ? null
                                : item.id
                            )
                          }
                          className="text-xl text-gray-500"
                        >
                          ⋮
                        </button>

                        {openMenu === item.id && (

                          <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 w-44">

                              <button
                                  onClick={() => {

                                      window.open(
                                          `${API_BASE_URL}/ai/history/download/${item.id}`,
                                          "_blank"
                                      );

                                      setOpenMenu(null);

                                  }}
                                  className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                              >
                                  Download Report
                              </button>

                              <button
                                  onClick={() => deleteInterview(item.id)}
                                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              >

                                  Delete

                              </button>

                          </div>

                        )}

                      </div>
                </div>



                {/* SCORE */}
                <div className="mt-4 flex items-center justify-between">

                  <div>
                    <p className="text-xs text-gray-500">Score</p>
                    <p className="text-lg font-bold text-indigo-600">
                      {item.totalScore}/50
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-full border-[4px] border-indigo-500 flex items-center justify-center text-sm font-semibold text-indigo-600">
                    {Math.round((item.totalScore / 50) * 100)}%
                  </div>

                </div>

                <button
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg text-sm"
                  onClick={() => {

                    setSelectedInterviewId(item.id);

                    setCurrentPage("interviewDetails");

                  }}
                >
                  View Details
                </button>

              </div>
            ))
          ))}

        {/* RESUME TAB */}
        {activeTab === "resume" &&
          (resumeHistory.length === 0 ? (
            <EmptyState text="No resume analysis yet" />
          ) : (
            resumeHistory.map((item, index) => (
              <div
                  key={item.id}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >

                  <div className="flex justify-between">

                      <div>

                          <h3 className="font-semibold text-gray-800">
                              {item.targetRole}
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                              {item.resumeName}
                          </p>

                          <p className="text-xs text-gray-400">
                              {item.uploadedAt}
                          </p>

                      </div>

                      <div className="relative">

                          <button
                              onClick={() =>
                                  setOpenMenu(
                                      openMenu === item.id
                                          ? null
                                          : item.id
                                  )
                              }
                              className="text-xl text-gray-500"
                          >
                              ⋮
                          </button>

                          {openMenu === item.id && (

                              <div
                                  className="
                                  absolute
                                  right-0
                                  mt-2
                                  bg-white
                                  border
                                  rounded-lg
                                  shadow-md
                                  z-10
                                  w-44
                                  "
                              >

                                  <button
                                      onClick={() => downloadResume(item.id)}
                                      className="
                                          w-full
                                          px-4
                                          py-2
                                          text-left
                                          text-sm
                                          hover:bg-gray-100
                                      "
                                  >
                                      Download Report
                                  </button>

                                  <button
                                      onClick={() => deleteResume(item.id)}
                                      className="
                                      w-full
                                      px-4
                                      py-2
                                      text-left
                                      text-sm
                                      text-red-600
                                      hover:bg-gray-100
                                      "
                                  >

                                      Delete

                                  </button>

                              </div>

                          )}

                      </div>

                  </div>

                  <div className="mt-4 flex justify-between">

                      <div>

                          <p className="text-xs text-gray-500">
                              ATS Score
                          </p>

                          <p className="font-semibold text-green-600">
                              {item.atsScore}%
                          </p>

                      </div>

                      <div>

                          <p className="text-xs text-gray-500">
                              Skills Match
                          </p>

                          <p className="font-semibold text-indigo-600">
                              {item.skillsMatchPercentage}%
                          </p>

                      </div>

                      <div>

                          <p className="text-xs text-gray-500">
                              Keyword Match
                          </p>

                          <p className="font-semibold text-orange-500">
                              {item.keywordMatchPercentage}%
                          </p>

                      </div>

                  </div>

                  <button

                      className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg text-sm"

                      onClick={() => {

                          setSelectedResumeId(item.id);

                          setCurrentPage("resumeDetails");

                      }}

                  >

                      View Report

                  </button>

              </div>
            ))
          ))}

      </div>

    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center bg-white rounded-xl p-10 shadow-sm">
      <p className="text-gray-400">{text}</p>
    </div>
  );
}