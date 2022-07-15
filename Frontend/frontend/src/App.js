import './App.css';
import React, { useState } from 'react';

function App() {
  const [value, setValue] = useState([]);

  const getData = async () => {
    const response = await fetch("http://localhost:3000/checkAttendanceStatus",
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    const json = await response.json();
    console.log(json);
    setValue(json);
  };

  return <>
    <p>Hello</p>
    <button onClick={getData}>getdata</button>
    {
      Array.from(value).map(val => {
        return <div>
          <h1>{val.name} - {val.attendance} </h1>
        </div>
      })
    }
  </>
}

export default App;
