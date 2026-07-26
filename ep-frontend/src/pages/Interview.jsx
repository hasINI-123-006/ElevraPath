import { useState, useRef, useEffect } from "react";
import CustomSelect from "./CustomSelect";
import AlertModal from "../pages/AlertModal";
import ConfirmModal from "../pages/ConfirmModal";
import API, { API_BASE_URL } from "../api";

export default function Interview() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);

  const [role, setRole] = useState("");
  const [type, setType] = useState("technical");
  const [questionLimit, setQuestionLimit] = useState(10);

  const [feedback, setFeedback] = useState(null);
  const [editing, setEditing] = useState(false);

  const [sessionId, setSessionId] = useState(null);

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [startingInterview, setStartingInterview] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [pendingRestart, setPendingRestart] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");
    const showAlert = (title, message) => {

        setAlertTitle(title);

        setAlertMessage(message);

        setAlertOpen(true);

    };

  const chatEndRef = useRef(null);
  const interviewRef = useRef(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startInterview = async () => {

    if (!role) {
      showAlert(
          "Missing Role",
          "Please enter the job role."
      );
      return;
    }
setLoading(true);

    try {
        setStartingInterview(true);
        let extractedResumeText = "";
        if (resumeFile) {

          const formData = new FormData();

          formData.append("file", resumeFile);

          const uploadResponse = await API.post(
            "/ai/uploadResume",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );

          extractedResumeText =
              uploadResponse.data.resumeText;

          console.log(extractedResumeText);
        }


      const loggedInUser = JSON.parse(
          localStorage.getItem("loggedInUser")
      );

      const response = await API.post(
        "/ai/startInterview",
        {
            jobRole: role,
            type: type,
            questionLimit: questionLimit,
            resumeText: extractedResumeText,
            jobDescription: "",
            userId: loggedInUser.id,

            resumeUsed: resumeFile != null,
            resumeName: resumeFile ? resumeFile.name : null
        }
      );

      setSessionId(response.data.sessionId);

      setStarted(true);
      setStartingInterview(false);
      setEditing(false);

      setMessages([
        {
          type: "ai",
          text: response.data.question
        }
      ]);

    } catch (error) {

      console.error(error);
      setStartingInterview(false);

      showAlert(
          "Interview Error",
          "Failed to start the interview. Please try again."
      );
    }
finally {

        setLoading(false);

    }
  };

  // ANALYZE ANSWER
  const handleAnalyze = async () => {

    if (!input.trim()) return;

    const currentAnswer = input;

    setMessages(prev => [
      ...prev,
      {
        type: "user",
        text: currentAnswer
      }
    ]);
setLoading(true);

    try {

     const currentQuestion =
       [...messages]
         .reverse()
         .find(msg => msg.type === "ai")?.text;

      const response = await API.post(
        "/ai/answer",
        {
          sessionId,
          question: currentQuestion,
          answer: currentAnswer,
          jobRole: role
        }
      );

      setFeedback({
        score: response.data.score,
        feedback: response.data.feedback,
        improved: response.data.improvedAnswer,
        ideal: response.data.idealAnswer
      });
  setTimeout(() => {
      feedbackRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
      });
  }, 150);

      setMessages(prev => [
        ...prev,
        {
          type: "ai",
          text: response.data.nextQuestion
        }
      ]);

      setInput("");

      // Scroll back to interview panel on mobile
      setTimeout(() => {
        interviewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

    } catch (error) {

      console.error(error);

      showAlert(
          "Analysis Failed",
          "Unable to evaluate your answer. Please try again."
      );
    }
finally{

    setLoading(false);

}
  };



  return (
    <div className="h-[90vh] flex flex-col xl:flex-row gap-6">

      {/* LEFT SIDE */}
      <div
          ref={interviewRef}
          className="w-full xl:flex-1 flex flex-col bg-gradient-to-b from-[#0f172a] to-[#1e293b] rounded-2xl overflow-visible xl:overflow-hidden"
      >

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-700 text-white">

          <div className="font-semibold">AI Interviewer</div>

          {started && !editing && (
            <div className="text-sm text-gray-300 mt-2 flex flex-wrap items-center gap-2">

              <span>Role: {role}</span>

              <span>|</span>

              <span>Type: {type}</span>

              <span>|</span>

              <span>Questions: {questionLimit}</span>
              {resumeFile ? (
                <>
                  <span>|</span>
                  <span className="text-green-400">
                    Using Resume ✓
                  </span>
                </>
              ) : (
                <>
                  <span>|</span>
                  <span className="text-gray-400">
                    No Resume
                  </span>
                </>
              )}

              <button
                onClick={() => setEditing(true)}
                className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded"
              >
                Change
              </button>

            </div>
          )}
        </div>

        {/* EDIT MODE */}
        {editing && (
          <div className="p-4 bg-white flex flex-col lg:flex-row gap-3">
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full lg:flex-1 p-2 border rounded"
            />

            <CustomSelect
                value={type}
                onChange={setType}
                width="w-full lg:w-[140px]"
                options={[
                    "Technical",
                    "Behavioral",
                    "Project"
                ]}
            />
            <CustomSelect
                value={`${questionLimit} Questions`}
                onChange={(value) => setQuestionLimit(parseInt(value))}
                width="w-full lg:w-[140px]"
                options={[
                    "10 Questions",
                    "15 Questions",
                    "20 Questions"
                ]}
            />

            <button
              onClick={() => setShowRestartModal(true)}
              className="w-full lg:w-auto bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        )}

        {/* START SECTION */}
        {!started && (
            <>
          <div className="p-4 bg-white flex flex-col lg:flex-row gap-3">
            <input
              placeholder="Role (Ex : Java Developer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full lg:w-[260px] p-2 border rounded"
            />

            <CustomSelect
                value={type}
                onChange={setType}
                width="w-full lg:w-[140px]"
                options={[
                    "Technical",
                    "Behavioral",
                    "Project"
                ]}
            />
            <CustomSelect
                value={`${questionLimit} Questions`}
                onChange={(value) => setQuestionLimit(parseInt(value))}
                width="w-full lg:w-[140px]"
                options={[
                    "10 Questions",
                    "15 Questions",
                    "20 Questions"
                ]}
            />

            <label className="w-full lg:w-auto bg-gray-100 border rounded px-4 py-2 cursor-pointer hover:bg-gray-200">
              Choose Resume
              <input
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
            </label>
<button
  onClick={startInterview}
  disabled={startingInterview}
  className={`w-full lg:w-[90px] text-white rounded transition ${
    startingInterview
      ? "bg-indigo-400 cursor-not-allowed"
      : "bg-indigo-600 hover:bg-indigo-700"
  }`}
>
  {startingInterview ? "Starting..." : "Start"}
</button>

          </div>
          {resumeFile && (
            <div className="px-4 pb-3 bg-white">
              <p className="text-sm text-green-600">
                ✓ Resume Selected:
                <span className="font-medium">
                  {" "}{resumeFile.name}
                </span>
              </p>
            </div>
          )}
      </>
        )}

        {/* CHAT AREA */}
        <div className="flex-1 min-h-[300px] lg:min-h-0 overflow-y-auto px-4 lg:px-6 py-4 space-y-4">

          {messages.map((msg, i) => (
              <>
            <div
              key={i}
              className={`flex items-end gap-2 ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >

              {msg.type === "ai" && (
                <div className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-full text-xs">
                  AI
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                  msg.type === "ai"
                    ? "bg-white text-black"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {msg.text}
              </div>

              {msg.type === "user" && (
                <div className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full text-xs">
                  You
                </div>
              )}
            </div>
            {msg.type === "user" && feedback && i === messages.length - 2 && (
                <div className="xl:hidden w-full mt-4">

                    {/* SCORE */}
                    <div className="bg-indigo-50 rounded-xl p-5 mb-4">

                        <h4 className="font-semibold text-gray-700 mb-3">
                            Score
                        </h4>

                        <div className="text-3xl font-bold text-indigo-600">
                            {feedback.score}
                        </div>

                    </div>

                    {/* FEEDBACK */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">

                        <p className="font-semibold text-gray-700 mb-2">
                            Feedback
                        </p>

                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {feedback.feedback}
                        </p>

                    </div>

                    {/* IMPROVED */}
                    <div className="bg-blue-50 rounded-xl p-4 mb-4">

                        <p className="font-semibold text-blue-700 mb-2">
                            How to Improve
                        </p>

                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {feedback.improved}
                        </p>

                    </div>

                    {/* IDEAL */}
                    <div className="bg-green-50 rounded-xl p-4">

                        <p className="font-semibold text-green-700 mb-2">
                            Ideal Answer
                        </p>

                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {feedback.ideal}
                        </p>

                    </div>

                </div>
            )}
          </>
          ))}

          <div ref={chatEndRef}></div>
        </div>

        {/* INPUT BAR */}
        {started && (
          <div className="p-4 border-t border-gray-700 bg-[#0f172a] flex flex-col sm:flex-row gap-2">

            <input
                disabled={loading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                  loading
                      ? "AI is evaluating..."
                      : "Type your answer..."
              }
              className="flex-1 p-3 rounded-lg outline-none"
            />

            <button
                onClick={handleAnalyze}
                disabled={loading}
              className="w-full sm:w-auto bg-green-600 text-white px-4 rounded-lg py-3"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>



          </div>
        )}

      </div>

      <div className="hidden xl:flex xl:w-80 bg-white rounded-2xl shadow-sm flex-col">

        {/* HEADER */}
        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-800">
            Answer Evaluation
          </h3>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {!feedback ? (
            <p className="text-gray-400 text-sm">
              Submit answer to see analysis
            </p>
          ) : (
            <>
              {/* SCORE */}
              <div className="bg-indigo-50 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">

                <div>
                  <p className="text-xs text-gray-500">Score</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {feedback.score}
                  </p>
                </div>

                <div className="w-16 h-16 rounded-full border-[5px] border-indigo-500 flex items-center justify-center text-sm font-semibold text-indigo-600">
                  {feedback.score}
                </div>

              </div>

              {/* FEEDBACK */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Feedback</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {feedback.feedback}
                </p>
              </div>

              {/* IMPROVEMENT */}
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-blue-600 mb-1 font-medium">
                  How to Improve
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {feedback.improved}
                </p>
              </div>

              {/* IDEAL ANSWER */}
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-600 mb-2 font-medium">
                  Ideal Answer
                </p>

                <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {feedback.ideal}
                </pre>
              </div>
            </>
          )}

        </div>

      </div>
      <AlertModal
          open={alertOpen}
          title={alertTitle}
          message={alertMessage}
          confirmText="OK"
          showCancel={false}
          onConfirm={() => setAlertOpen(false)}
      />
      <ConfirmModal
          open={showRestartModal}
          title="Restart Interview"
          message="Changing the role or interview type will restart the interview. Continue?"
          confirmText="Ok"
          cancelText="Cancel"
          onConfirm={() => {

              setStarted(false);
              setEditing(false);

              setMessages([]);
              setFeedback(null);

              setSessionId(null);

              setShowRestartModal(false);

          }}
          onCancel={() => setShowRestartModal(false)}
      />

    </div>
  );
}