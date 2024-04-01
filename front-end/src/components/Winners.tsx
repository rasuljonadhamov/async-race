import { useState } from "react";

interface Car {
  id: number;
  name: string;
  color: string;
  wins: number;
  bestTime: string;
}

const Winners: React.FC = () => {
  const [winners, setWinners] = useState<Car[]>([]);

  const sortByWins = () => {
    const sortedWinners = [...winners].sort((a, b) => b.wins - a.wins);
    setWinners(sortedWinners);
  };

  const sortByBestTime = () => {
    const sortedWinners = [...winners].sort((a, b) => {
      const timeA = Date.parse("1970-01-01T" + a.bestTime + "Z");
      const timeB = Date.parse("1970-01-01T" + b.bestTime + "Z");
      return timeA - timeB;
    });
    setWinners(sortedWinners);
  };

  const mockWinners: Car[] = [
    { id: 1, name: "Car 1", color: "#ff0000", wins: 5, bestTime: "00:15:30" },
    { id: 2, name: "Car 2", color: "#00ff00", wins: 3, bestTime: "00:12:45" },
    { id: 3, name: "Car 3", color: "#0000ff", wins: 2, bestTime: "00:10:20" },
  ];

  useState(() => {
    setWinners(mockWinners);
  }, []);

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
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Wins</th>
            <th className="px-4 py-2">Best Time</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((car) => (
            <tr key={car.id}>
              <td className="px-4 py-2">
                <div
                  className="w-8 h-8"
                  style={{ backgroundColor: car.color }}
                ></div>
              </td>
              <td className="px-4 py-2">{car.name}</td>
              <td className="px-4 py-2">{car.wins}</td>
              <td className="px-4 py-2">{car.bestTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Winners;
