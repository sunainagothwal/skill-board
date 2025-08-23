import toast from "react-hot-toast";

let currentToastId = null;

export const showError = (message) => {
  if (currentToastId) {
    toast.dismiss(currentToastId);
  }
  currentToastId = toast.error(message, {
    duration: 4000,
    position: "top-center",
  });
};

export const showSuccess = (message) => {
  if (currentToastId) {
    toast.dismiss(currentToastId);
  }
  currentToastId = toast.success(message, {
    duration: 4000,
    position: "top-center",
  });
};
