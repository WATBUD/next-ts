"use client";
import React, { useState } from "react";
export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [tilte, setTilte] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const totalAmount = expenses.reduce(
    (total, expenses) => total + expenses.price,
    0
  );
  const addExpense = () => {
    if (tilte.trim() === "" || price.trim() === "") return;
    setExpenses([
      ...expenses,
      { id: Date.now(), tilte, price: parseFloat(price) },
    ]);
    setTilte("");
    setPrice("");
  };
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditingTitle(item.title);
    setEditingPrice(item.price.toString());
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((item) => item.id !== item));
  };
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="title"
          value={tilte}
          onChange={(e) => setTilte(e.target.value)}
        />
        <input
          type="number"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={addExpense}> Add</button>
      </div>
      <ul>
        {expenses.map((item) => (
          <li key={item.id}>
            {editingId === item.id ? (
              <>
                <input
                  type="text"
                  placeholder="title"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="price"
                  value={editingPrice}
                  onChange={(e) => setEditingPrice(e.target.value)}
                />
              </>
            ) : (
              <div>
                {item.tilte}:${item.tilte}
                <button onClick={() => startEditing(item)}>edit</button>
                <button onClick={() => deleteExpense(item.id)}>delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h2>total:{totalAmount} </h2>
    </div>
  );
}
