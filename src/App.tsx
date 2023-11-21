import React from 'react';
import './App.css';
import UserAuth from './UserAuth';
import ConnectionBox from './ConnectionBox';
import { GlobalProvider } from './GlobalContext';

function App() {
  return (
    <GlobalProvider>
      <div className="App">
        <header className="App-header">
          <ConnectionBox />
          <UserAuth />
          {/* Other components like ChatArea, ContactList, etc. can be added here as needed */}
        </header>
      </div>
    </GlobalProvider>
  );
}

export default App;
