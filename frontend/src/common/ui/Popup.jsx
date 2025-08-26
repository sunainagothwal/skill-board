import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { usePopup } from "../context/PopupContext";
//import { FaTimes } from "react-icons/fa";

const Popup = () => {
  const { popup, closePopup } = usePopup();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closePopup();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closePopup]);
 
  useEffect(() => {
    const rootEl = document.getElementById("root");
    if (popup) {
      rootEl.classList.add('blur-background');
    } else {
      rootEl.classList.remove('blur-background');
    }
  }, [popup]);
  if (!popup) return null;

  const { title, body } = popup;
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold mb-0">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closePopup}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4">{body}</div>

      </div>
    </div>,
    document.body
  );
};

export default Popup;
