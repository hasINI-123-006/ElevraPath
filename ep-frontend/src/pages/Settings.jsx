import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";
import AlertModal from "./AlertModal";
import {
  User,
  Mail,
  Lock,
  Shield,
  HelpCircle,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";

export default function Settings() {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: ""
    });
const [showPasswordModal, setShowPasswordModal] = useState(false);

const [currentPassword, setCurrentPassword] = useState("");

const [newPassword, setNewPassword] = useState("");

const [confirmPassword, setConfirmPassword] = useState("");
const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [alertOpen, setAlertOpen] = useState(false);
const [alertTitle, setAlertTitle] = useState("");
const [alertMessage, setAlertMessage] = useState("");

const [confirmOpen, setConfirmOpen] = useState(false);
const [confirmTitle, setConfirmTitle] = useState("");
const [confirmMessage, setConfirmMessage] = useState("");
const [confirmAction, setConfirmAction] = useState(null);
const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOpen(true);
};

const showConfirm = (title, message, action) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmOpen(true);
};

    useEffect(() => {

        const loggedInUser = JSON.parse(
            localStorage.getItem("loggedInUser")
        );

        if (loggedInUser) {

            setUser(loggedInUser);

        }

    }, []);
const saveProfile = async () => {

    try {

        const response = await axios.put(

            `http://localhost:8080/user/${user.id}`,

            {
                name: user.name,
                email: user.email
            }

        );

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(response.data)
        );

        setUser(response.data);

        showAlert(
            "Profile Updated",
            "Your profile has been updated successfully."
        );

    }

    catch (error) {

        console.error(error);

        console.log(error.response);

        console.log(error.response?.data);

        showAlert(
            "Update Failed",
            "Unable to update your profile."
        );

    }

};
const changePassword = async () => {

    if (!currentPassword.trim()) {
        showAlert(
            "Current Password Required",
            "Please enter your current password."
        );
        return;
    }

    if (!newPassword.trim()) {
        showAlert(
            "New Password Required",
            "Please enter your new password."
        );
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert(
            "Password Mismatch",
            "New password and confirm password must match."
        );
        return;
    }

    try {

        const response = await axios.post(
            "http://localhost:8080/change-password",
            {
                userId: user.id,
                currentPassword,
                newPassword
            }
        );

        showAlert(
            "Password Updated",
            response.data.message
        );

        setShowPasswordModal(false);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

    }

    catch (error) {

        showAlert(
            "Password Update Failed",
            error.response?.data?.message ||
            "Failed to update password."
        );

    }

};
const clearHistory = async () => {

    showConfirm(
        "Clear History",
        "Are you sure you want to clear all resume analyses and interview history?",
        async () => {

            try {

                await axios.post(
                    "http://localhost:8080/clear-history",
                    null,
                    {
                        params: {
                            userId: user.id
                        }
                    }
                );

                showAlert(
                    "History Cleared",
                    "All resume analyses and interview history have been removed."
                );

            } catch (error) {

                showAlert(
                    "Failed",
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to clear history."
                );

            }

        }
    );

    return;

    try {

        await axios.post(
            "http://localhost:8080/clear-history",
            null,
            {
                params: {
                    userId: user.id
                }
            }
        );

        showAlert(
            "History Cleared",
            "All resume analyses and interview history have been removed."
        );

    }

    catch (error) {

        console.error(error);

        console.log("Backend response:", error.response?.data);

        showAlert(
            "Failed",
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to clear history."
        );

    }

};
const deleteAccount = async () => {

    showConfirm(
        "Delete Account",
        "This will permanently delete your account and all your data.\n\nThis action cannot be undone.",
        async () => {

            try {

                await axios.delete(
                    "http://localhost:8080/delete-account",
                    {
                        params: {
                            userId: user.id
                        }
                    }
                );

                localStorage.removeItem("loggedInUser");

                window.location.reload();

            } catch (error) {

                showAlert(
                    "Delete Failed",
                    error.response?.data ||
                    "Failed to delete account."
                );

            }

        }
    );

    return;

    try {

        await axios.delete(
            "http://localhost:8080/delete-account",
            {
                params: {
                    userId: user.id
                }
            }
        );

        localStorage.removeItem("loggedInUser");

        showAlert(
            "Account Deleted",
            "Your account has been deleted successfully."
        );

        localStorage.removeItem("loggedInUser");

        window.location.href = "/login";

    } catch (error) {

        console.error(error);

        showAlert(
            "Delete Failed",
            error.response?.data ||
            "Failed to delete account."
        );

    }

};
  return (
      <>
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 space-y-4 lg:space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account and application preferences
          </p>
        </div>


      </div>

      {/* ACCOUNT */}
      <SectionCard icon={<User size={18} />} title="Account" subtitle="Manage your basic account information">

        <div className="mt-5">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                <InputField
                    label="Full Name"
                    icon={<User size={16} />}
                    value={user.name}
                    onChange={(e) =>
                        setUser({
                            ...user,
                            name: e.target.value
                        })
                    }
                    readOnly={false}
                />

                <InputField
                    label="Email Address"
                    icon={<Mail size={16} />}
                    value={user.email}
                    readOnly={true}
                />

                {/* Password */}
                <div>
                    <label className="text-sm font-semibold text-gray-700">
                        Password
                    </label>

                    <div className="mt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 flex-1">
                            <Lock size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                                ••••••••
                            </span>
                        </div>

                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full sm:w-auto border px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 whitespace-nowrap"
                        >
                            Change Password
                        </button>

                    </div>
                </div>

            </div>

            <div className="border-t mt-6 pt-4 flex justify-center sm:justify-end">

                <button
                    onClick={saveProfile}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
                >
                    Save Changes
                </button>

            </div>



        </div>
      </SectionCard>

      <SectionCard icon={<Shield size={18} />} title="Data & Privacy" subtitle="Manage your data and account privacy">

        <div className="divide-y mt-4">

          <DangerRow
              icon={<Trash2 size={16} />}
              title="Clear Analysis History"
              desc="Remove all your past resume analyses and interview history"
              button="Clear History"
              onClick={clearHistory}
          />

          <DangerRow
            icon={<User size={16} />}
            title="Delete Account"
            desc="Permanently delete your account and data"
            button="Delete Account"
            onClick={deleteAccount}
          />

        </div>
      </SectionCard>



    </div>
    {
        showPasswordModal && (

              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                  <div className="bg-white rounded-xl p-5 w-[92%] max-w-[420px]">

                      <h2 className="text-xl font-semibold mb-5">
                          Change Password
                      </h2>

                      <div className="space-y-4">

                          <div className="relative">
                              <input
                                  type={showCurrentPassword ? "text" : "password"}
                                  placeholder="Current Password"
                                  value={currentPassword}
                                  onChange={(e)=>setCurrentPassword(e.target.value)}
                                  className="w-full border rounded-lg px-3 py-2 pr-10"
                              />

                              <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="absolute right-3 top-2.5 text-gray-500"
                              >
                                  {showCurrentPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                              </button>
                          </div>

                          <div className="relative">
                              <input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="New Password"
                                  value={newPassword}
                                  onChange={(e)=>setNewPassword(e.target.value)}
                                  className="w-full border rounded-lg px-3 py-2 pr-10"
                              />

                              <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-2.5 text-gray-500"
                              >
                                  {showNewPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                              </button>
                          </div>

                          <div className="relative">
                              <input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm Password"
                                  value={confirmPassword}
                                  onChange={(e)=>setConfirmPassword(e.target.value)}
                                  className="w-full border rounded-lg px-3 py-2 pr-10"
                              />

                              <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-2.5 text-gray-500"
                              >
                                  {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                              </button>
                          </div>

                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">

                          <button
                              onClick={()=>setShowPasswordModal(false)}
                              className="w-full sm:w-auto border px-4 py-2 rounded-lg"
                          >
                              Cancel
                          </button>

                          <button
                              onClick={changePassword}
                              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
                          >
                              Update Password
                          </button>

                      </div>

                  </div>

              </div>

              )
              }
          <AlertModal
                    open={alertOpen}
                    title={alertTitle}
                    message={alertMessage}
                    confirmText="OK"
                    showCancel={false}
                    onConfirm={() => setAlertOpen(false)}
                />

                <ConfirmModal
                    open={confirmOpen}
                    title={confirmTitle}
                    message={confirmMessage}
                    confirmText="Yes"
                    cancelText="Cancel"
                    onConfirm={() => {
                        confirmAction?.();
                        setConfirmOpen(false);
                    }}
                    onCancel={() => setConfirmOpen(false)}
                />
    </>
  );
}


function SectionCard({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 lg:p-6">

      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>

      {children}
    </div>
  );
}

function InputField({
    icon,
    label,
    value,
    onChange,
    readOnly = true
}) {
    return (
        <div>
            <label className="text-sm font-semibold text-gray-700">
                {label}
            </label>

            <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 w-full">
                <span className="text-gray-400">
                    {icon}
                </span>

                <input
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    className="bg-transparent outline-none text-sm w-full"
                />
            </div>
        </div>
    );
}

function ToggleRow({ icon, title, desc }) {
  return (
    <div className="flex justify-between items-center py-4">

      <div className="flex items-start gap-3">

        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>

      </div>

      <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow"></div>
      </div>

    </div>
  );
}

function DangerRow({
    icon,
    title,
    desc,
    button,
    onClick
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4">

      <div className="flex items-start gap-3">
        <div className="bg-red-100 text-red-500 p-2 rounded-lg">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>

      <button
          onClick={onClick}
          className="w-full sm:w-auto text-sm border px-4 py-2 rounded-lg text-red-500 hover:bg-red-50"
      >
        {button}
      </button>

    </div>
  );
}