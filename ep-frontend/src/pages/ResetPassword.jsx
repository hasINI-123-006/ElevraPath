import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {

    const token = new URLSearchParams(window.location.search).get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleReset = async () => {

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {

            const res = await axios.post(
                "http://localhost:8080/reset-password",
                {
                    token,
                    newPassword
                }
            );

            alert(res.data.message);

            window.location.href = "/";

        } catch (err) {

            alert("Unable to reset password.");

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-lg w-96">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Reset Password
                </h2>

                <div className="relative mb-4">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border rounded-lg p-3 pr-12"
                    />

                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="relative mb-6">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border rounded-lg p-3 pr-12"
                    />

                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <button
                    onClick={handleReset}
                    className="w-full bg-indigo-600 text-white rounded-lg py-3 hover:bg-indigo-700"
                >
                    Reset Password
                </button>

            </div>

        </div>

    );

}