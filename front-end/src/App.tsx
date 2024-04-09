import React, { useState } from "react";
import Garage from "./components/Garage";
import Winners from "./components/Winners";

enum Page {
  Garage,
  Winners,
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Garage);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Garage:
        return <Garage />;
      case Page.Winners:
        return <Winners />;
      default:
        return null;
    }
  };

  return (
    <div className="App pt-20 bg-gray-900 h-full">
      <header className="App-header container mx-auto px-6 ">
        <div className="mb-4">
          <button
            onClick={() => setCurrentPage(Page.Garage)}
            className={`mr-2 ${
              currentPage === Page.Garage
                ? "bg-blue-500"
                : "bg-gray-300 hover:bg-gray-400"
            } text-white py-2 px-4 rounded`}
          >
            Garage
          </button>
          <button
            onClick={() => setCurrentPage(Page.Winners)}
            className={`mr-2 ${
              currentPage === Page.Winners
                ? "bg-blue-500"
                : "bg-gray-300 hover:bg-gray-400"
            } text-white py-2 px-4 rounded`}
          >
            Winners
          </button>
        </div>
        {renderPage()}
      </header>
    </div>
  );
};

export default App;
