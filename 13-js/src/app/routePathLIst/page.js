"use client";

import { useState } from "react";
import Link from "next/link";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(true);

  // const toggleMenu = () => {
  //   setIsOpen(!isOpen);
  // };

  return (
    <div className="dropdown-menu">
      {/* <button
        className="dropdown-toggle"
        onClick={toggleMenu}
        style={{ backgroundColor: "blue" }}
      >
        OpenMenu
      </button> */}
      {isOpen && (
        <ul className="dropdown-list">
          <li>
            <Link href="/">HomePage</Link>
          </li>
          <li>
            <Link href="/question1">question1</Link>
          </li>
          <li>
            <Link href="/dashboard_Table">dashboard_Table</Link>
          </li>
          <li>
            <Link href="/shopping-cart">shopping-cart</Link>
          </li>
          <li>
            <Link href="/debounce-throttle">debounce-throttle</Link>
          </li>
          
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
