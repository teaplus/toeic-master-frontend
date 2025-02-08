import React from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { NoticeProvider } from "./components/common/Notice";
import { LoadingProvider } from "./contexts/LoadingContext";
function App() {
  return (
    <div className="App relative">
      <LoadingProvider>
        <NoticeProvider>
          <AppRoutes />
        </NoticeProvider>
      </LoadingProvider>
    </div>
  );
}

export default App;
