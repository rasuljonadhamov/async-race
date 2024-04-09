import React, { useState, useEffect } from "react";
import API, { Car, Winner } from "../Api/Api";

const Winners: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const sortByWins = () => {
    const sortedWinners = [...winners].sort((a, b) => b.wins - a.wins);
    setWinners(sortedWinners);
  };

  const sortByBestTime = () => {
    const sortedWinners = [...winners].sort((a, b) => {
      const timeA = new Date("1970-01-01T" + a.time + "Z").getTime();
      const timeB = new Date("1970-01-01T" + b.time + "Z").getTime();
      return timeA - timeB;
    });
    setWinners(sortedWinners);
  };

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const winnersData = await API.getWinners();
        const carsData = await API.getCars();
        const winnersWithCarDetails: Winner[] = [];

        for (const winner of winnersData) {
          const car = carsData.items.find((car) => car.id === winner.id);
          if (car) {
            winnersWithCarDetails.push({
              ...winner,
              name: car.name,
              color: car.color,
            });
          }
        }

        setWinners(winnersWithCarDetails);
      } catch (error) {
        console.error("Error fetching winners:", error);
      }
    };

    fetchWinners();
  }, []);

  const totalPages = Math.ceil(winners.length / pageSize);

  const paginatedWinners = winners.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl mb-4">Winners</h2>
      <div className="mb-4">
        <button
          onClick={sortByWins}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2"
        >
          Sort by Wins
        </button>
        <button
          onClick={sortByBestTime}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Sort by Best Time
        </button>
      </div>
      <table className="w-full text-center">
        <thead>
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Wins</th>
            <th className="px-4 py-2">Best Time</th>
          </tr>
        </thead>
        <tbody className="">
          {paginatedWinners.map((winner) => (
            <tr key={winner.id}>
              <td className="px-4 py-2">
                <div
                  className="w-8 h-8 "
                  style={{ backgroundColor: winner.color }}
                ></div>
              </td>
              <td className="px-4 py-2">{winner.name}</td>
              <td className="px-4 py-2">{winner.wins}</td>
              <td className="px-4 py-2">{(winner.time / 100).toFixed(2)} s</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`mr-2 ${
              page === index + 1 ? "bg-blue-500" : "bg-gray-500"
            } hover:bg-blue-700 text-white py-2 px-4 rounded`}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Winners;
