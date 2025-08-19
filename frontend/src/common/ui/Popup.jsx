import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useLayout } from "../context/LayoutContext";
import { FaTimes } from "react-icons/fa";

const Popup = () => {
  const { popup, closePopup } = useLayout();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closePopup();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closePopup]);

  if (!popup) return null;

  const { title, body } = popup;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closePopup}
          >
            <FaTimes />
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
