"use client";
import React, { useState,useMemo } from "react";
export default function App() {
  const [data, setData] = useState([]);
  const [title, setTilte] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const totalAmount = useMemo(() =>
    data.reduce((total, item) => total + item.price, 0, [data])
  );

  const addItem = () => {
    if (title.trim() === "" || price.trim() === "") return;
    setData([
      ...data,
      { id: Date.now(), title: title, price: parseFloat(price) },
    ]);
    setTilte("");
    setPrice("");
  };

  const saveEdit = (id) => {
    console.log(id);
    setData(
      data.map((item) =>
        item.id === id
          ? { ...item, title: item.title, price: parseFloat(item.price) }
          : item
      )
    );
    setEditingId(null);
  };

  const handleTitleChange = (e, id) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, title: e.target.value } : item
      )
    );
  };
  const handlePriceChange = (e, id) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, price: parseFloat(e.target.value) } : item
      )
    );
  };

  const deleteItem = (id) => {
    console.log(id);
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder=""
          value={title}
          onChange={(e) => setTilte(e.target.value)}
        />

        <input
          type="number"
          placeholder=""
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={addItem}> Add</button>
      </div>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {editingId === item.id ? (
              <>
                <input
                  type="text"
                  placeholder="title"
                  value={item.title}
                  onChange={(e) => handleTitleChange(e, item.id)}
                />
                <input
                  type="number"
                  placeholder="price"
                  value={item.price}
                  onChange={(e) => handlePriceChange(e, item.id)}
                />
                <button onClick={() => saveEdit(item.id)}>save</button>
              </>
            ) : (
              <div>
                {item.title}:${item.price}
                <button onClick={() => setEditingId(item.id)}>edit</button>
                <button onClick={() => deleteItem(item.id)}>delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h2>total:{totalAmount} </h2>
    </div>
  );
}

