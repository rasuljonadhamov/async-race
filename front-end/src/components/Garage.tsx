import React, { useState, useEffect, useRef } from "react";
import API from "../Api/Api";
import { renderCar } from "./RenderCar";
import WinnerModal from "./WinnerModal.tsx";
import "../index.css";

interface Car {
  id: number;
  name: string;
  color: string;
  isEngineStarted: boolean;
}

interface WinCar {
  id: number;
  velocity: string;
  distance: string;
}

const carNames = [
  "Tesla",
  "Model S",
  "Ford",
  "Mustang",
  "Lambargini",
  "Bugatti",
  "Ferrari",
  "G Class",
  "Mercades",
  "AMG",
  "Chiron",
  "Tayota",
  "Chazor",
  "BMW",
  "Volkswagen",
  "Volvo",
  "Audi",
  "Mercedes-Benz",
];

const Garage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const carRef = useRef<HTMLDivElement>();
  const [newCarName, setNewCarName] = useState<string>("");
  const [newCarColor, setNewCarColor] = useState<string>("#000000");
  const [editCarId, setEditCarId] = useState<number | null>(null);
  const [editCarName, setEditCarName] = useState<string>("");
  const [editCarColor, setEditCarColor] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [raceAnimationInProgress, setRaceAnimationInProgress] =
    useState<boolean>(false);
  const [individualAnimationInProgress, setIndividualAnimationInProgress] =
    useState<number | null>(null);
  const [winner, setWinner] = useState<WinCar | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [winnerName, setWinnerName] = useState<Car | null>(null);
  const carsPerPage = 7;

  useEffect(() => {
    getCars();
  }, []);

  const getCars = async () => {
    try {
      const { items } = await API.getCars();
      setCars(items);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const generateRandomCars = async () => {
    try {
      const randomCars: Car[] = [];
      for (let i = 1; i <= 100; i++) {
        const randomColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
        const randomNameIndex = Math.floor(Math.random() * carNames.length);
        const newCar: Car = await API.createCar({
          name: carNames[randomNameIndex],
          color: randomColor,
        });
        randomCars.push(newCar);
      }
      setCars([...cars, ...randomCars]);
    } catch (error) {
      console.error("Error generating random cars:", error);
    }
  };

  const addCar = async () => {
    try {
      if (!newCarName.trim()) return;
      const newCar: Car = await API.createCar({
        name: newCarName,
        color: newCarColor,
      });
      setCars([...cars, newCar]);
      setNewCarName("");
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  const deleteCar = async (id: number) => {
    const confirmModal = confirm("Are you sure you want to delete");

    if (confirmModal) {
      try {
        await API.deleteCar(id);
        setCars(cars.filter((car) => car.id !== id));
      } catch (error) {
        console.error("Error deleting car:", error);
      }
    }
  };

  const startEditCar = (id: number, name: string, color: string) => {
    setEditCarId(id);
    setEditCarName(name);
    setEditCarColor(color);
  };

  const saveEditCar = async () => {
    try {
      if (!editCarName.trim()) return;
      await API.updateCar(editCarId!, {
        name: editCarName,
        color: editCarColor,
      });
      setCars(
        cars.map((car) =>
          car.id === editCarId
            ? { ...car, name: editCarName, color: editCarColor }
            : car
        )
      );
      setEditCarId(null);
      setEditCarName("");
      setEditCarColor("");
    } catch (error) {
      console.error("Error saving edited car:", error);
    }
  };

  const cancelEditCar = () => {
    setEditCarId(null);
    setEditCarName("");
    setEditCarColor("");
  };

  const divElMumer = (isIndividualAnimation?: boolean) => {
    const screenWidth = window.innerWidth;
    const translateDistance = isIndividualAnimation
      ? screenWidth * 0.7
      : screenWidth * 0.6;
    return {
      transform: `translateX(${translateDistance}px)`,
      transition: `all ${Math.floor(Math.random() * 3) + 0.5}s ease-in-out`,
    };
  };

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars ? cars.slice(indexOfFirstCar, indexOfLastCar) : [];

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const stopEngine = async (id: number) => {
    try {
      await API.stopEngine(id);
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.id === id ? { ...car, isEngineStarted: false } : car
        )
      );
    } catch (error) {
      console.error("Error stopping engine:", error);
    }
  };

  const startEngine = async (id: number) => {
    try {
      const response = await API.startEngine(id);

      if (!response.success) {
        const prev = (prevCars) =>
          prevCars.map((car) =>
            car.id === id ? { ...car, isEngineStarted: true } : car
          );

        const winn = cars.filter((car) => car.id === id);

        const car = {
          id: id,
          distance: response.distance,
          velocity: response.velocity,
          name: winn[0].name,
        };

        const winnerToApi = { id: car.id, wins: 1, time: car.velocity };

        setWinnerName(car);
        await API.createWinner(winnerToApi);
        setIndividualAnimationInProgress(id);
        setTimeout(() => {
          setIndividualAnimationInProgress(null);
          setShowWinnerModal(true);
        }, Math.floor(Math.random() * 4000));
      } else {
        console.error("Failed to start engine:", response.error);
      }
    } catch (error) {
      console.error("Error starting engine:", error);
    }
  };

  const startRace = async () => {
    try {
      setRaceAnimationInProgress(true);

      const raceResults = await Promise.all(
        currentCars.map(async (car) => {
          const response = await API.startEngine(car.id);
          console.log(response);

          const { velocity, distance } = response;
          return { id: car.id, velocity, distance };
        })
      );

      const validResults = raceResults.filter(
        (result) =>
          result.velocity !== undefined && result.distance !== undefined
      );

      if (validResults.length === 0) {
        console.error("No valid race results found.");
        return;
      }

      const winningCar = validResults.reduce((prev, curr) => {
        return prev.velocity > curr.velocity ? prev : curr;
      });

      setShowWinnerModal(true);

      setWinner(winningCar);
      const winnerToApi = {
        id: winningCar.id,
        wins: 1,
        time: winningCar.velocity,
      };

      console.log(winnerToApi, "to Api");

      await API.createWinner(winnerToApi);

      setTimeout(() => {
        setRaceAnimationInProgress(false);
      }, 1000);
    } catch (error) {
      console.error("Error starting race:", error);
    }
  };

  useEffect(() => {
    if (winner) {
      const winnerr = cars.find((car) => car.id === winner.id);
      console.log(winnerr?.name, "ii");

      setWinnerName({ ...winner, name: winnerr?.name });
    }
  }, [showWinnerModal]);

  const resetRace = () => {
    setRaceAnimationInProgress(false);
    setIndividualAnimationInProgress(null);
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl mb-4">Garage</h2>
      <div className="flex items-center mb-4">
        <button
          onClick={startRace}
          className="bg-green-500 text-amber-50 py-2 px-3 mr-2 rounded-sm"
        >
          Race
        </button>
        <button
          onClick={resetRace}
          className="bg-red-500 text-amber-50 py-2 px-3 mr-2 rounded-sm"
        >
          Reset
        </button>
        <input
          type="text"
          value={newCarName}
          onChange={(e) => setNewCarName(e.target.value)}
          placeholder="Enter car name"
          className="border p-2 mr-2 w-40 text-black"
        />
        <input
          type="color"
          value={newCarColor}
          onChange={(e) => setNewCarColor(e.target.value)}
          className="mr-2 text-black"
        />
        <button
          onClick={addCar}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Add Car
        </button>
        <button
          onClick={generateRandomCars}
          className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded ml-2"
        >
          Generate Random Cars
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {currentCars.map((car: Car) => (
          <div
            ref={carRef}
            key={car.id}
            className="border border-gray-300 rounded-md p-4"
          >
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-2 items-start justify-center mt-2">
                <button
                  onClick={() => startEditCar(car.id, car.name, car.color)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded mr-2"
                >
                  Select
                </button>
                <button
                  onClick={() => deleteCar(car.id)}
                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                >
                  Remove
                </button>
              </div>
              <div className="flex flex-col gap-2 items-start justify-center mt-2">
                <button
                  id={`start-engine-button-${car.id}`}
                  onClick={() => startEngine(car.id)}
                  disabled={car.isEngineStarted}
                  className={`mr-2 bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded ${
                    car.isEngineStarted && "opacity-50 cursor-not-allowed"
                  } `}
                >
                  A
                </button>

                <button
                  onClick={() => stopEngine(car.id)}
                  disabled={!car.isEngineStarted}
                  className={`bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded ${
                    !car.isEngineStarted && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  B
                </button>
              </div>

              <div
                key={car.id}
                style={
                  raceAnimationInProgress
                    ? divElMumer()
                    : individualAnimationInProgress === car.id
                    ? divElMumer()
                    : undefined
                }
                dangerouslySetInnerHTML={{ __html: renderCar(car) }}
              />
            </div>
            {editCarId === car.id && (
              <div className="mt-2">
                <input
                  type="text"
                  value={editCarName}
                  onChange={(e) => setEditCarName(e.target.value)}
                  placeholder="Enter car name"
                  className="border text-black p-2 mr-2 w-40"
                />
                <input
                  type="color"
                  value={editCarColor}
                  onChange={(e) => setEditCarColor(e.target.value)}
                  className="mr-2"
                />
                <button
                  onClick={saveEditCar}
                  className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditCar}
                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <div className="px-3 mt-2 ml-5">Cars ({cars.length})</div>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l mr-2"
        >
          Prev
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={cars?.length <= carsPerPage * currentPage}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
        >
          Next
        </button>
        <div className="ml-10 pt-2">
          {currentPage} out of{" "}
          {Math.ceil(cars.length / 7) ? Math.ceil(cars.length / 7) : 1}
        </div>

        {showWinnerModal && (
          <WinnerModal
            winnerName={winnerName}
            cars={cars}
            onClose={() => setShowWinnerModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Garage;
