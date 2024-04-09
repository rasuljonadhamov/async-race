import React, { useState, useEffect } from "react";
import API, { Car, Winner } from "../Api/Api";

const Winners: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);

  const sortByWins = () => {
    const sortedWinners = [...winners].sort((a, b) => b.wins - a.wins);
    setWinners(sortedWinners);
  };

  const sortByBestTime = () => {
    const sortedWinners = [...winners].sort((a, b) => {
      // Convert time strings to Date objects for comparison
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
        console.log(winnersWithCarDetails, "details");

        setWinners(winnersWithCarDetails);
      } catch (error) {
        console.error("Error fetching winners:", error);
      }
    };

    fetchWinners();
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
          {winners.map((winner) => (
            <tr key={winner.id}>
              <td className="px-4 py-2">
                <div
                  className="w-8 h-8 "
                  style={{ backgroundColor: winner.color }}
                ></div>
              </td>
              <td className="px-4 py-2">{winner.name}</td>
              <td className="px-4 py-2">{winner.wins}</td>
              <td className="px-4 py-2">{winner.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Winners;

// import React, { useState, useEffect } from "react";
// import API, { Car, Winner } from "../Api/Api";

// const Winners: React.FC = () => {
//   const [winners, setWinners] = useState<Winner[]>([]);

//   const sortByWins = () => {
//     const sortedWinners = [...winners].sort((a, b) => b.wins - a.wins);
//     setWinners(sortedWinners);
//   };

//   const sortByBestTime = () => {
//     const sortedWinners = [...winners].sort((a, b) => {
//       const timeA = Date.parse("1970-01-01T" + a.bestTime + "Z");
//       const timeB = Date.parse("1970-01-01T" + b.bestTime + "Z");
//       return timeA - timeB;
//     });
//     setWinners(sortedWinners);
//   };

//   useEffect(() => {
//     const fetchWinners = async () => {
//       try {
//         const winnersData = await API.getWinners();
//         const carsData = await API.getCars();
//         const winnersWithCarDetails: Winner[] = [];

//         for (const winner of winnersData) {
//           const car = carsData.items.find((car) => car.id === winner.id);
//           if (car) {
//             winnersWithCarDetails.push({
//               ...winner,
//               name: car.name,
//               color: car.color,
//             });
//           }
//         }
//         console.log(
//           { ...winnersWithCarDetails, time: winnersWithCarDetails.velocity },
//           "details"
//         );

//         setWinners(winnersWithCarDetails);
//       } catch (error) {
//         console.error("Error fetching winners:", error);
//       }
//     };

//     fetchWinners();
//   }, []);

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl mb-4">Winners</h2>
//       <div className="mb-4">
//         <button
//           onClick={sortByWins}
//           className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2"
//         >
//           Sort by Wins
//         </button>
//         <button
//           onClick={sortByBestTime}
//           className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
//         >
//           Sort by Best Time
//         </button>
//       </div>
//       <table className="w-full text-center">
//         <thead>
//           <tr>
//             <th className="px-4 py-2">Image</th>
//             <th className="px-4 py-2">Name</th>
//             <th className="px-4 py-2">Wins</th>
//             <th className="px-4 py-2">Best Time</th>
//           </tr>
//         </thead>
//         <tbody className="">
//           {winners.map((winner) => (
//             <tr key={winner.id}>
//               <td className="px-4 py-2">
//                 <div
//                   className="w-8 h-8 "
//                   style={{ backgroundColor: winner.color }}
//                 ></div>
//               </td>
//               <td className="px-4 py-2">{winner.name}</td>
//               <td className="px-4 py-2">{winner.wins}</td>
//               <td className="px-4 py-2">{winner.time}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Winners;
