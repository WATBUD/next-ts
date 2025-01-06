"use client";
import React, { useState,useMemo } from "react";
export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTilte] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const totalAmount = useMemo(() =>
    expenses.reduce((total, expenses) => total + expenses.price, 0, [expenses])
  );

  const addExpense = () => {
    if (title.trim() === "" || price.trim() === "") return;
    setExpenses([
      ...expenses,
      { id: Date.now(), title: title, price: parseFloat(price) },
    ]);
    setTilte("");
    setPrice("");
  };

  const saveEdit = (id) => {
    console.log(id);
    setExpenses(
      expenses.map((item) =>
        item.id === id
          ? { ...item, title: item.title, price: parseFloat(item.price) }
          : item
      )
    );
    setEditingId(null);
  };

  const handleTitleChange = (e, id) => {
    setExpenses(
      expenses.map((item) =>
        item.id === id ? { ...item, title: e.target.value } : item
      )
    );
  };
  const handlePriceChange = (e, id) => {
    setExpenses(
      expenses.map((item) =>
        item.id === id ? { ...item, price: parseFloat(e.target.value) } : item
      )
    );
  };

  const startEditing = (item) => {
    console.log(item);
    setEditingId(item.id);
  };

  const deleteExpense = (id) => {
    console.log(id);
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="title"
          value={title}
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
                <button onClick={() => setEditingId(null)}>cancel</button>
              </>
            ) : (
              <div>
                {item.title}:${item.price}
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

