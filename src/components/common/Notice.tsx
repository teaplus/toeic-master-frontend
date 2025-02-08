import React, { createContext, useContext } from "react";

type NoticeType = {
  show: (type: "success" | "error", message: string) => void;
};

const NoticeContext = createContext<NoticeType | undefined>(undefined);

export const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const show = (type: "success" | "error", message: string) => {
    const notice = document.createElement("div");

    notice.innerHTML = `
      <div class="fixed bottom-4 left-4 z-50 animate-slide-up rounded-lg px-4 py-3 shadow-lg flex items-center space-x-3 min-w-[300px] 
        ${
          type === "success"
            ? "bg-green-100 border border-green-400 text-green-700"
            : "bg-red-100 border border-red-400 text-red-700"
        }">
        ${
          type === "success"
            ? '<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>'
            : '<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>'
        }
        <p class="font-medium flex-grow">${message}</p>
        <button class="flex-shrink-0 -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-100">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notice);

    // Add click event for close button
    const closeButton = notice.querySelector("button");
    if (closeButton) {
      closeButton.onclick = () => {
        if (document.body.contains(notice)) {
          document.body.removeChild(notice);
        }
        return false;
      };
    }

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notice)) {
        document.body.removeChild(notice);
      }
    }, 3000);
  };

  return (
    <NoticeContext.Provider value={{ show }}>{children}</NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error("useNotice must be used within a NoticeProvider");
  }
  return context;
};
