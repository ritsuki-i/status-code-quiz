import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./components/Home";
import QuizMode from "./components/QuizMode";
import KarutaMode from "./components/KarutaMode";
import PracticeMode from "./components/PracticeMode";
import StatusCodeData from "./components/StatusCodeData";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <BrowserRouter basename="/status-code-quiz">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizmode" element={<QuizMode />} />
          <Route path="/karutamode" element={<KarutaMode />} />
          <Route path="/practicemode" element={<PracticeMode />} />
          <Route path="/statuscodedata" element={<StatusCodeData />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
