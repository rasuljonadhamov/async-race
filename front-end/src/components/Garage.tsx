import React, { useState } from "react";

interface Car {
  id: number;
  name: string;
  color: string;
}

const Garage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [newCarName, setNewCarName] = useState<string>("");
  const [newCarColor, setNewCarColor] = useState<string>("#000000");
  const [editCarId, setEditCarId] = useState<number | null>(null);
  const [editCarName, setEditCarName] = useState<string>("");
  const [editCarColor, setEditCarColor] = useState<string>("");


  const addCar = () => {
    if (!newCarName.trim()) return;
    const newCar: Car = {
      id: new Date().getTime(),
      name: newCarName,
      color: newCarColor,
    };
    setCars([...cars, newCar]);
    setNewCarName("");
  };

  
  const deleteCar = (id: number) => {
    setCars(cars.filter((car) => car.id !== id));
  };


  const startEditCar = (id: number, name: string, color: string) => {
    setEditCarId(id);
    setEditCarName(name);
    setEditCarColor(color);
  };


  const saveEditCar = () => {
    if (!editCarName.trim()) return;
    setCars(
      cars.map((car) => {
        if (car.id === editCarId) {
          return { ...car, name: editCarName, color: editCarColor };
        }
        return car;
      })
    );
    setEditCarId(null);
    setEditCarName("");
    setEditCarColor("");
  };

  const cancelEditCar = () => {
    setEditCarId(null);
    setEditCarName("");
    setEditCarColor("");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Garage</h2>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={newCarName}
          onChange={(e) => setNewCarName(e.target.value)}
          placeholder="Enter car name"
          className="border p-2 mr-2 w-40"
        />
        <input
          type="color"
          value={newCarColor}
          onChange={(e) => setNewCarColor(e.target.value)}
          className="mr-2"
        />
        <button
          onClick={addCar}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Add Car
        </button>
      </div>
      <ul>
        {cars.map((car) => (
          <li
            key={car.id}
            className="flex items-center justify-between border-b py-2"
          >
            {editCarId === car.id ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editCarName}
                  onChange={(e) => setEditCarName(e.target.value)}
                  className="border p-2 mr-2 w-40"
                />
                <input
                  type="color"
                  value={editCarColor}
                  onChange={(e) => setEditCarColor(e.target.value)}
                  className="mr-2"
                />
                <button
                  onClick={saveEditCar}
                  className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditCar}
                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded ml-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <span style={{ color: car.color }}>{car.name}</span>
                <button
                  onClick={() => startEditCar(car.id, car.name, car.color)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded ml-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCar(car.id)}
                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded ml-2"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Garage;
