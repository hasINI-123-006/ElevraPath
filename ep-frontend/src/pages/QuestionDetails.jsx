import { useEffect, useState } from "react";
import API, { API_BASE_URL } from "../api";

export default function QuestionDetails({
    interviewId,
    setCurrentPage
}) {

    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        loadQuestions();

    }, [interviewId]);
const loadQuestions = async () => {

    try {

        const response = await API.get(

            `/ai/history/${interviewId}`

        );

        setQuestions(response.data.questions);
        setSelectedQuestion(0);

        setLoading(false);

    }

    catch (error) {

        console.error(error);

    }

};
if (loading) {

    return <div className="p-8">Loading...</div>;

}
const totalQuestions = questions.length;

const averageScore =
  totalQuestions > 0
    ? (
        questions.reduce((sum, q) => sum + q.score, 0) /
        totalQuestions
      ).toFixed(1)
    : 0;

const bestScore =
  totalQuestions > 0
    ? Math.max(...questions.map(q => q.score))
    : 0;

const lowestScore =
  totalQuestions > 0
    ? Math.min(...questions.map(q => q.score))
    : 0;

    return (

        <div className="p-4 md:p-8">

            <button
                onClick={() => setCurrentPage("interviewDetails")}
                className="text-indigo-600 font-medium mb-6 hover:underline"
            >
                ← Back to Interview Report
            </button>

            <h1 className="text-2xl md:text-3xl font-bold">
                Questions & Answers
            </h1>

            <p className="text-gray-500 mb-8">
                Detailed breakdown of your answers and performance
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Questions
                    </p>

                    <h2 className="text-3xl font-bold text-indigo-600 mt-2">
                        {totalQuestions}
                    </h2>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Average Score
                    </p>

                    <h2 className="text-3xl font-bold text-blue-600 mt-2">
                        {averageScore}/10
                    </h2>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Best Score
                    </p>

                    <h2 className="text-3xl font-bold text-green-600 mt-2">
                        {bestScore}/10
                    </h2>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Lowest Score
                    </p>

                    <h2 className="text-3xl font-bold text-red-500 mt-2">
                        {lowestScore}/10
                    </h2>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-4 lg:sticky lg:top-6 self-start">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

                        <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            Questions
                        </h2>


                    </div>

                    <div className="space-y-3 max-h-[650px] overflow-y-auto pr-2">

                        {questions.map((q, index) => (

                            <div
                                key={index}
                                onClick={() => setSelectedQuestion(index)}
                                className={`cursor-pointer rounded-2xl border transition-all duration-200 p-4

                                ${
                                    selectedQuestion === index
                                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                                        : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                                }`}
                            >

                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">

                                    <div className="flex items-center gap-3">

                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold

                                            ${
                                                selectedQuestion === index
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-indigo-100 text-indigo-600"
                                            }`}
                                        >
                                            {index + 1}
                                        </div>

                                        <div>

                                            <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                                                Technical
                                            </span>


                                        </div>

                                    </div>

                                    <div className="text-right">

                                        <p className="text-lg font-bold text-indigo-600">
                                            {q.score}/10
                                        </p>

                                    </div>

                                </div>

                                <p className="mt-4 text-sm text-gray-700 line-clamp-2">
                                    {q.question}
                                </p>

                            </div>
                            ))}

                    </div>
                    </div>

                </div>

                {/* RIGHT PANEL */}

                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">

                    <div className="flex justify-between items-start mb-6">

                        <div className="flex-1">

                            <p className="text-lg text-indigo-700 font-semibold mb-2">
                                Interview Question
                            </p>

                            <h2 className="text-lg font-semibold text-gray-800 leading-7">
                                {questions[selectedQuestion]?.question}
                            </h2>

                        </div>



                    </div>

                    <div className="space-y-6">

                        <div className="space-y-6">

                            {/* Candidate Answer */}

                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">

                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl">
                                        👤
                                    </div>

                                    <div>

                                        <h3 className="font-bold text-gray-800">
                                            Your Answer
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Response given during interview
                                        </p>

                                    </div>

                                </div>

                                <p className="leading-7 text-gray-700 whitespace-pre-wrap break-words">

                                    {questions[selectedQuestion]?.candidateAnswer}

                                </p>

                            </div>

                            {/* Ideal Answer */}

                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">

                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                                        🤖
                                    </div>

                                    <div>

                                        <h3 className="font-bold text-gray-800">
                                            Ideal Answer
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            AI recommended response
                                        </p>

                                    </div>

                                </div>

                                <p className="leading-7 text-gray-700 whitespace-pre-wrap break-words">

                                    {questions[selectedQuestion]?.idealAnswer}

                                </p>

                            </div>

                        </div>



                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">

                            <h3 className="text-lg font-semibold text-indigo-700 mb-4">
                                Analysis
                            </h3>

                            <p className="leading-7 text-gray-700 whitespace-pre-wrap break-words">
                                {questions[selectedQuestion]?.feedback}
                            </p>

                        </div>
                        <div className="bg-indigo-100 rounded-xl p-5">

                            <h3 className="font-semibold text-indigo-700 mb-3">
                                How to Improve
                            </h3>

                            <ul className="space-y-3 break-words">

                                {questions[selectedQuestion]?.improvement
                                    ?.split(/\r?\n|(?=\d+\.)|(?=- )/)
                                    .filter(item => item.trim() !== "")
                                    .map((item, index) => (

                                        <li
                                            key={index}
                                            className="flex items-start gap-3"
                                        >

                                            <span className="text-gray-700 leading-7">
                                                {item.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "")}
                                            </span>

                                        </li>

                                    ))}

                            </ul>

                        </div>

                    </div>

                </div>
                </div>

            </div>

        </div>

    );

}