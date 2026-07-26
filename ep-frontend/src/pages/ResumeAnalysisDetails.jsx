import { useEffect, useState } from "react";
import axios from "axios";

export default function ResumeAnalysisDetails({
    resumeId,
    setCurrentPage
}) {

    const [report, setReport] = useState(null);

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {

        try {

            const response = await axios.get(
                `http://localhost:8080/ai/resume-history/${resumeId}`
            );

            setReport(response.data);

        }

        catch (error) {

            console.error(error);

        }

    };

    if (!report) {

        return (
            <div className="p-8">
                Loading...
            </div>
        );

    }

    return (

        <div className="space-y-6">

            {/* BACK BUTTON */}

            <button
                onClick={() => setCurrentPage("history")}
                className="text-indigo-600 font-medium"
            >
                ← Back to History
            </button>

            {/* PAGE TITLE */}

            <div>

                <h1 className="text-3xl font-bold text-gray-800">

                    Resume Analysis Report

                </h1>

                <p className="text-gray-500 mt-2">

                    Complete AI evaluation of your uploaded resume

                </p>

            </div>

            {/* HEADER CARD */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                <div className="flex justify-between items-start">

                    <div>

                        <h2 className="text-2xl font-semibold text-gray-800">

                            {report.targetRole}

                        </h2>

                        <p className="text-gray-500 mt-2">

                            📄 {report.resumeName}

                        </p>

                        <p className="text-gray-400 text-sm mt-1">

                            Uploaded on {report.uploadedAt}

                        </p>

                    </div>

                    <div className="text-right">

                        <p className="text-sm text-gray-500">

                            Hiring Decision

                        </p>

                        <span className="inline-block mt-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">

                            {report.hiringDecision}

                        </span>

                    </div>

                </div>

            </div>
            {/* SCORE CARDS */}

            <div className="grid grid-cols-3 gap-5">

                {/* ATS */}

                <div className="bg-white rounded-2xl border border-gray-200 p-6">

                    <p className="text-sm text-gray-500">

                        ATS Score

                    </p>

                    <h2 className="text-3xl font-bold text-indigo-600 mt-3">

                        {report.atsScore}%

                    </h2>

                    <p className="text-sm text-gray-500 mt-2">

                        ATS Compatibility

                    </p>

                </div>

                {/* ROLE MATCH */}

                <div className="bg-white rounded-2xl border border-gray-200 p-6">

                    <p className="text-sm text-gray-500">

                        Role Match

                    </p>

                    <h2 className="text-3xl font-bold text-violet-600 mt-3">

                        {report.skillsMatchPercentage}%

                    </h2>

                    <p className="text-sm text-gray-500 mt-2">

                        Match Quality

                    </p>

                </div>

                {/* KEYWORD MATCH */}

                <div className="bg-white rounded-2xl border border-gray-200 p-6">

                    <p className="text-sm text-gray-500">

                        Keyword Match

                    </p>

                    <h2 className="text-3xl font-bold text-orange-500 mt-3">

                        {report.keywordMatchPercentage}%

                    </h2>

                    <p className="text-sm text-gray-500 mt-2">

                        Resume Keywords

                    </p>

                </div>

            </div>
            {/* RESUME SUMMARY */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                <h3 className="text-xl font-semibold text-gray-800 mb-4">

                    Resume Summary

                </h3>

                <p className="text-gray-600 leading-8">

                    {report.resumeSummary}

                </p>

            </div>
            {/* STRENGTHS + WEAKNESSES */}

            <div className="grid md:grid-cols-2 gap-5">

                {/* Strengths */}

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                    <h3 className="text-xl font-semibold text-green-600 mb-5">

                        Strengths

                    </h3>

                    <div className="space-y-4">

                        {report.strengths
                            ?.split("\n")
                            .map((item, index) => (

                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >

                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>

                                    <p className="text-gray-700">

                                        {item}

                                    </p>

                                </div>

                            ))}

                    </div>

                </div>

                {/* Areas to Improve */}

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                    <h3 className="text-xl font-semibold text-red-500 mb-5">

                        Areas to Improve

                    </h3>

                    <div className="space-y-4">

                        {report.weaknesses
                            ?.split("\n")
                            .map((item, index) => (

                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >

                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>

                                    <p className="text-gray-700">

                                        {item}

                                    </p>

                                </div>

                            ))}

                    </div>

                </div>

            </div>
            {/* TOP SKILLS */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                <h3 className="text-xl font-semibold text-gray-800 mb-5">

                    Top Skills Identified

                </h3>

                <div className="flex flex-wrap gap-3">

                    {report.topSkills
                        ?.split("\n")
                        .map((skill, index) => (

                            <span
                                key={index}
                                className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium"
                            >
                                {skill}
                            </span>

                        ))}

                </div>

            </div>
            {/* MISSING SKILLS */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                <h3 className="text-xl font-semibold text-gray-800 mb-5">

                    Missing Skills

                </h3>

                <div className="flex flex-wrap gap-3">

                    {report.missingSkills
                        ?.split("\n")
                        .map((skill, index) => (

                            <span
                                key={index}
                                className="px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium"
                            >
                                {skill}
                            </span>

                        ))}

                </div>

            </div>
          {/* RESUME INSIGHTS */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                <h3 className="text-xl font-semibold text-gray-800 mb-5">

                    Resume Insights

                </h3>

                <div className="space-y-4">

                    {report.resumeInsights
                        ?.split("\n")
                        .map((item, index) => (

                            <div
                                key={index}
                                className="flex gap-3 items-start"
                            >

                                <span className="text-indigo-500 mt-1">

                                    💡

                                </span>

                                <p className="text-gray-700">

                                    {item}

                                </p>

                            </div>

                        ))}

                </div>

            </div>
            {/* RECRUITER CHECKLIST */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                <h3 className="text-xl font-semibold text-gray-800 mb-5">

                    Recruiter Checklist

                </h3>

                <div className="space-y-3">

                    {report.checklist
                        ?.split("\n")
                        .map((item, index) => {

                            const [title, status] = item.split("|");

                            return (

                                <div
                                    key={index}
                                    className="flex justify-between items-center"
                                >

                                    <span className="text-gray-700">

                                        {title}

                                    </span>

                                    <span
                                        className={`font-medium
                                        ${
                                            status === "Present"
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }`}
                                    >

                                        {status === "Present"
                                            ? "✔ Present"
                                            : "✖ Missing"}

                                    </span>

                                </div>

                            );

                        })}

                </div>

            </div>
            {/* PRIORITY LEARNING AREAS */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                <h3 className="text-xl font-semibold text-gray-800 mb-5">

                    Priority Learning Areas

                </h3>

                <div className="space-y-4">

                    {report.suggestions
                        ?.split("\n")
                        .map((item, index) => {

                            const [priority, text] = item.split("|");

                            return (

                                <div
                                    key={index}
                                    className="flex justify-between items-center border-b border-gray-100 pb-3"
                                >

                                    <span className="text-gray-700">

                                        {text}

                                    </span>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium
                                        ${
                                            priority === "High"
                                                ? "bg-red-100 text-red-600"
                                                : priority === "Medium"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                        }`}
                                    >

                                        {priority}

                                    </span>

                                </div>

                            );

                        })}

                </div>

            </div>
            {/* AI RECRUITER TIP */}

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">

                <h3 className="text-xl font-semibold text-blue-700 mb-4">

                    AI Recruiter Tip

                </h3>

                <p className="text-gray-700 leading-8">

                    {report.recruiterTip}

                </p>

            </div>


        </div>

    );

}