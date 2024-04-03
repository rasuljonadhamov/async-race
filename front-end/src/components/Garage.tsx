import React, { useState, useEffect } from "react";
import API from "../Api/Api";
import { renderCar } from "./RenderCar";
import "../index.css";

interface Car {
  id: number;
  name: string;
  color: string;
  isEngineStarted: boolean;
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
];

const Garage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
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
    try {
      await API.deleteCar(id);
      setCars(cars.filter((car) => car.id !== id));
    } catch (error) {
      console.error("Error deleting car:", error);
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
      await API.startEngine(id);
      setIndividualAnimationInProgress(id);

      const updatedCars = cars.map((car) =>
        car.id === id ? { ...car, isEngineStarted: true } : car
      );
      setCars(updatedCars);

      setTimeout(() => {
        setIndividualAnimationInProgress(null);
      }, 1000);
    } catch (error) {
      console.error("Error starting engine:", error);
    }
  };

  const startRace = async () => {
    try {
      setRaceAnimationInProgress(true);

      await Promise.all(
        cars.map(async (car) => {
          await API.startEngine(car.id);
        })
      );

      setTimeout(() => {
        setRaceAnimationInProgress(false);
      }, 1000);
    } catch (error) {
      console.error("Error starting race:", error);
    }
  };

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
        {currentCars.map((car) => (
          <div key={car.id} className="border border-gray-300 rounded-md p-4">
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
                className={`rounded-md p-4 ${
                  raceAnimationInProgress ||
                  individualAnimationInProgress === car.id
                    ? "moveCarAnimation"
                    : ""
                }`}
                dangerouslySetInnerHTML={{ __html: renderCar(car) }}
              />
              <div
                className={`rounded-md p-4  ${
                  raceAnimationInProgress ||
                  individualAnimationInProgress === car.id
                    ? "moveCarAnimation"
                    : ""
                }`}
                style={{ color: car.color }}
              >
                {car.name}
              </div>
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
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
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
      </div>
    </div>
  );
};

export default Garage;
