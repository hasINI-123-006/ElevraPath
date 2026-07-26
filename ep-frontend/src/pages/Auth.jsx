import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import AlertModal from "../pages/AlertModal";
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";
import logo from "../assets/logo.jpeg";

export default function Auth({
    setIsLoggedIn,
    setCurrentPage
}) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const [alertTitle, setAlertTitle] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const showAlert = (title, message) => {

      setAlertTitle(title);

      setAlertMessage(message);

      setAlertOpen(true);

  };

const handleSubmit = async () => {

  try {


    if (!email.trim()) {
      showAlert(
          "Validation",
          "Please enter your email."
      );
      return;
    }

    if (mode !== "forgot" && !password.trim()) {
      showAlert(
          "Validation",
          "Please enter your password."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        showAlert(
                  "Validation",
                  "Please enter a valid email address."
              );
      return;
    }


    if (mode === "signup") {

      if (!name.trim()) {
        showAlert(
            "Validation",
            "Please enter your full name."
        );
        return;
      }

      await axios.post(
        "http://localhost:8080/saveUser",
        {
          name,
          email,
          password
        }
      );

      showAlert(
          "Success",
          "Account created successfully."
      );

      setMode("login");
    }

    else if (mode === "login") {

      const response = await axios.post(
        "http://localhost:8080/login",
        {
          email,
          password
        }
      );

      const user = response.data;

      showAlert(
          "Success",
          user.message
      );

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
      );
      setCurrentPage("dashboard");

      setIsLoggedIn(true);

    }


    else if (mode === "forgot") {

        const response = await axios.post(
            "http://localhost:8080/forgot-password",
            {
                email
            }
        );

        showAlert(
            "Success",
            response.data.message
        );

        setMode("login");

    }

  } catch (error) {


    showAlert(
        "Error",
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Something went wrong"
    );

  }

};

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl border shadow-sm">

        {/* LOGO */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain" />

              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ElevraPath
              </h1>
        </div>

        {mode !== "login" && (
          <button
            onClick={() => setMode("login")}
            className="flex items-center gap-2 text-sm text-gray-500 mb-4 hover:text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        )}

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          {mode === "login" && "Welcome Back!"}
          {mode === "signup" && "Create Account"}
          {mode === "forgot" && "Forgot Password"}
        </h2>

        <p className="text-sm text-gray-500 text-center mt-1 mb-6">
          {mode === "login" && "Sign in to continue your journey with ElevraPath"}
          {mode === "signup" && "Create your account to get started"}
          {mode === "forgot" && "Enter your email to reset password"}
        </p>

        {/* FORM */}
        <div className="space-y-4">

          {/* NAME */}
          {mode === "signup" && (
            <Field label="Full Name">
              <Input
                icon={<User size={16} />}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
          )}

          {/* EMAIL */}
          <Field label="Email Address">
            <Input
              icon={<Mail size={16} />}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          {/* PASSWORD */}
          {mode !== "forgot" && (
            <Field label="Password">
              <div className="relative">
                <Input
                  icon={<Lock size={16} />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
          )}

          {/* FORGOT */}
          {mode === "login" && (
            <div className="flex justify-end">
              <button
                onClick={() => setMode("forgot")}
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleSubmit}

            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition"
          >
            {mode === "login" && "Sign In"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Send Reset Link"}
          </button>

        </div>

        {/* DIVIDER */}
        {mode !== "forgot" && (
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
        )}

        {/* GOOGLE BUTTON */}
        {mode !== "forgot" && (
          <div className="w-full flex justify-center">
              <GoogleLogin
                  onSuccess={async (credentialResponse) => {

                      try {

                          const response = await axios.post(
                              "http://localhost:8080/google-login",
                              {
                                  credential: credentialResponse.credential
                              }
                          );

                          const user = response.data;

                          showAlert(
                              "Success",
                              user.message
                          );

                          localStorage.setItem(
                              "loggedInUser",
                              JSON.stringify(user)
                          );

                          setCurrentPage("dashboard");

                          setIsLoggedIn(true);

                      } catch (error) {
                          showAlert(
                              "Error",
                              error.response?.data?.message ||
                                                            error.message
                          );


                      }

                  }}
                  onError={() => {
                      showAlert(
                          "Error",
                          "Google Login Failed"
                      );
                  }}
              />
          </div>
        )}

        {/* FOOTER */}
        <div className="text-sm text-gray-500 mt-6 text-center">

          {mode === "login" && (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-indigo-600 font-medium"
              >
                Sign up
              </button>
            </>
          )}

          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-indigo-600 font-medium"
              >
                Sign in
              </button>
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
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Input({
  icon,
  placeholder,
  type = "text",
  value,
  onChange
}) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 transition">
      <span className="text-gray-400 mr-2">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-transparent outline-none w-full text-sm"
      />
    </div>
  );
}