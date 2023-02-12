import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import {User} from "./pages/User";

function App() {
  document.title = "Get started";
  return (
    <>
      <div className="container">
        <h1>Get started with react</h1>
      </div>
      <User/>
    </>
  );
}

export default App;
