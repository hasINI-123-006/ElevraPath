import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <Topbar />

        <div className="p-6 flex-1 overflow-hidden">
          {children}
        </div>

      </div>

    </div>
  );
}