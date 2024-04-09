import React from "react";
import "../index.css";

interface WinnerModalProps {
  winnerName: Car | null;
  cars: Car[];
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winnerName, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content text-black text-center">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Winner: {winnerName && winnerName?.name}</h2>
        <h2>
          Time:{" "}
          {((winnerName?.velocity / winnerName?.distance) * 1000).toFixed(2)} s
        </h2>
        {/* <h2>Distance: {winnerName?.distance}</h2> */}
      </div>
    </div>
  );
};

export default WinnerModal;
