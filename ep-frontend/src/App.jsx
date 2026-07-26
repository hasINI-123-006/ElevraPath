import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Analysis from "./pages/Analysis";
import Interview from "./pages/Interview";
import History from "./pages/History";
import Settings from "./pages/Settings";
import ConfirmModal from "./pages/ConfirmModal";
import InterviewDetails from "./pages/InterviewDetails";
import QuestionDetails from "./pages/QuestionDetails";
import ResumeAnalysisDetails from "./pages/ResumeAnalysisDetails";
import Auth from "./pages/Auth";
function App() {

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(
      !!localStorage.getItem("loggedInUser")
  );
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  useEffect(() => {

      if (isLoggedIn) {
          setCurrentPage("dashboard");
      }

  }, [isLoggedIn]);

   if (!isLoggedIn) {
       return (
           <Auth
               setIsLoggedIn={setIsLoggedIn}
               setCurrentPage={setCurrentPage}
           />
       );
   }


  return (

        <div className="flex h-screen overflow-hidden relative">



          <div className="hidden lg:block w-64 flex-shrink-0 border-r bg-white">
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setIsLoggedIn={setIsLoggedIn}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                showLogoutModal={showLogoutModal}
                            setShowLogoutModal={setShowLogoutModal}
            />
          </div>


          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300
            ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:hidden`}
          >
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={(page) => {
                    setCurrentPage(page);
                    setSidebarOpen(false);
                }}
                setIsLoggedIn={setIsLoggedIn}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}

                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
            />

          </div>


          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
      <ConfirmModal
                      open={showLogoutModal}
                      title="Logout"
                      message="Are you sure you want to logout?"
                      confirmText="Logout"
                      cancelText="Cancel"
                      onConfirm={() => {
                          localStorage.removeItem("loggedInUser");
                          setIsLoggedIn(false);
                          setShowLogoutModal(false);
                      }}
                      onCancel={() => setShowLogoutModal(false)}
                  />


          <div className="flex-1 flex flex-col overflow-y-auto">

            <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white">

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu size={28}/>
              </button>

              <h1 className="font-bold text-indigo-700 text-lg">
                ElevraPath
              </h1>

              <div className="w-7"></div>

            </div>

            <Topbar />

        <div className="p-3 sm:p-4 lg:p-6">
          {currentPage === "dashboard" && (
              <Dashboard setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "resume" && <ResumeAnalyzer />}
          {currentPage === "interview" && <Interview />}
          {currentPage === "history" && (
                         <History
                             setSelectedInterviewId={setSelectedInterviewId}
                             setSelectedResumeId={setSelectedResumeId}
                             setCurrentPage={setCurrentPage}
                         />
                       )}

                       {currentPage === "interviewDetails" && (
                         <InterviewDetails
                           interviewId={selectedInterviewId}
                           setCurrentPage={setCurrentPage}
                         />
                       )}
                   {currentPage === "resumeDetails" && (

                       <ResumeAnalysisDetails

                           resumeId={selectedResumeId}

                           setCurrentPage={setCurrentPage}

                       />

                   )}
                   {currentPage === "questionDetails" && (
                       <QuestionDetails
                           interviewId={selectedInterviewId}
                           setCurrentPage={setCurrentPage}
                       />
                   )}
          {currentPage === "settings" && <Settings />}

        </div>

      </div>

    </div>
  );
}

export default App;