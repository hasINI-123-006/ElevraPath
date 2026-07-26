import { useEffect, useState } from "react";
import axios from "axios";

export default function InterviewDetails({
  interviewId,
  setCurrentPage
}) {



  const [interview, setInterview] = useState(null);

  useEffect(() => {

    loadInterview();

  }, []);

  const loadInterview = async () => {

    try {

      const response = await axios.get(
        `http://localhost:8080/ai/history/${interviewId}`
      );

      setInterview(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  if (!interview) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

 return (
   <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
       <div className="mb-6">

         <button
             onClick={() => setCurrentPage("history")}
             className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
         >
             ← Back to History
         </button>

       </div>

     <h1 className="text-2xl md:text-4xl font-bold mb-2">
       Interview Report
     </h1>

     <p className="text-gray-500 mb-8">
       Detailed analysis of your AI interview performance
     </p>

     <div className="bg-white rounded-2xl shadow-sm border p-6">

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-center">

         <div>
           <p className="text-sm text-gray-500">
             Job Role
           </p>

           <h3 className="font-semibold text-lg">
             {interview.role}
           </h3>
         </div>

         <div>
           <p className="text-sm text-gray-500">
             Interview Type
           </p>

           <h3 className="font-semibold">
             {interview.interviewType}
           </h3>
         </div>

         <div>
           <p className="text-sm text-gray-500">
             Interview Date
           </p>

           <h3 className="font-semibold">
             {new Date(interview.completedAt)
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
           </h3>
         </div>



         <div className="flex justify-center">

           <div className="w-20 h-20 rounded-full border-[6px] border-indigo-600 flex items-center justify-center">

             <span className="font-bold text-indigo-600">
               {Math.round((interview.totalScore/50)*100)}%
             </span>

           </div>

         </div>

       </div>

     </div>
     {/* Statistics */}

     <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

       <div className="bg-white rounded-2xl shadow-sm border p-5">

         <p className="text-gray-500 text-sm">
           Total Score
         </p>

         <h2 className="text-3xl font-bold text-indigo-600 mt-2">
           {interview.totalScore}/50
         </h2>

         <div className="w-full bg-gray-200 rounded-full h-2 mt-4">

           <div
             className="bg-indigo-600 h-2 rounded-full"
             style={{
               width: `${(interview.totalScore / 50) * 100}%`
             }}
           ></div>

         </div>

       </div>

       <div className="bg-white rounded-2xl shadow-sm border p-5">

         <p className="text-gray-500 text-sm">
           Strengths
         </p>

         <h2 className="text-3xl font-bold text-green-600 mt-2">
           {interview.strengths
             ? interview.strengths.split(",").length
             : 0}
         </h2>

       </div>

       <div className="bg-white rounded-2xl shadow-sm border p-5">

         <p className="text-gray-500 text-sm">
           Areas to Improve
         </p>

         <h2 className="text-3xl font-bold text-red-600 mt-2">
           {interview.weaknesses
             ? interview.weaknesses.split(",").length
             : 0}
         </h2>

       </div>


     </div>

     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

         {/* Summary */}

         <div className="bg-white rounded-2xl shadow-sm border p-6">

             <h3 className="text-xl font-bold mb-4">
                 Overall Summary
             </h3>

             <p className="text-gray-600 leading-8">
                 {interview.summary}
             </p>

         </div>

         {/* Strengths */}

         <div className="bg-white rounded-2xl shadow-sm border p-6">

             <h3 className="text-xl font-bold text-green-600 mb-4">
                 Strengths
             </h3>

             <div className="space-y-2">
               {interview.strengths?.split("\n").map((point, index) => (
                 <div key={index} className="flex items-start gap-2">
                   <span className="text-black text-lg leading-6">•</span>
                   <span className="text-gray-600 leading-7">
                     {point.replace(/^•\s*/, "")}
                   </span>
                 </div>
               ))}
             </div>

         </div>

         {/* Areas */}

         <div className="bg-white rounded-2xl shadow-sm border p-6">

             <h3 className="text-xl font-bold text-red-600 mb-4">
                 Areas to Improve
             </h3>

             <div className="space-y-2">
               {interview.weaknesses?.split("\n").map((point, index) => (
                 <div key={index} className="flex items-start gap-2">
                   <span className="text-black text-lg leading-6">•</span>
                   <span className="text-gray-600 leading-7">
                     {point.replace(/^•\s*/, "")}
                   </span>
                 </div>
               ))}
             </div>

         </div>

     </div>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

       {/* Recommendations */}
       <div className="bg-white rounded-2xl border border-gray-200 p-6">

         <h2 className="text-2xl font-bold text-indigo-600 mb-4">
           Recommendations
         </h2>

         <div className="space-y-2">
           {interview.recommendations?.split("\n").map((point, index) => (
             <div key={index} className="flex items-start gap-2">
               <span className="text-black text-lg leading-6">•</span>
               <span className="text-gray-600 leading-7">
                 {point.replace(/^•\s*/, "")}
               </span>
             </div>
           ))}
         </div>

       </div>

       <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between">

         <div>

           <h2 className="text-2xl font-bold mb-4">
             Questions & Answers
           </h2>

           <p className="text-gray-500">
             Review every interview question with your answer,
             AI evaluation and score.
           </p>

         </div>

         <button
             onClick={() => setCurrentPage("questionDetails")}
             className="border border-indigo-600 text-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-50 transition"
         >
             View All Questions
         </button>

       </div>

     </div>

   </div>
 );
}