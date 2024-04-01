import React, { useState } from "react";

interface Item {
  id: number;
  name: string;
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemName, setItemName] = useState<string>("");
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editItemName, setEditItemName] = useState<string>("");

  const handleAddItem = () => {
    if (!itemName.trim()) return;
    const newItem: Item = {
      id: new Date().getTime(),
      name: itemName,
    };
    setItems([...items, newItem]);
    setItemName("");
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEditItem = (id: number, name: string) => {
    setEditItemId(id);
    setEditItemName(name);
  };

  const handleSaveEdit = () => {
    if (!editItemName.trim()) return;
    setItems(
      items.map((item) => {
        if (item.id === editItemId) {
          return { ...item, name: editItemName };
        }
        return item;
      })
    );
    setEditItemId(null);
    setEditItemName("");
  };

  const handleCancelEdit = () => {
    setEditItemId(null);
    setEditItemName("");
  };

  return (
    <div>
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {editItemId === item.id ? (
              <div>
                <input
                  type="text"
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                {item.name}
                <button onClick={() => handleEditItem(item.id, item.name)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
};

export default ItemList;
