import React from 'react';
import './App.css';
import UserAuth from './UserAuth';
import ConnectionBox from './ConnectionBox';
import { GlobalProvider } from './GlobalContext';
import ChatArea from './ChatArea';
import { ChatProvider } from './ChatContext';
//import ContactList from './ContactList';

function App() {
  return (
    <GlobalProvider>
      <div className="App">
        <header className="App-header">
          <ConnectionBox />
          {/* Other components like ChatArea, ContactList, etc. can be added here as needed */}
        </header>

        {// <ContactList />
        }
        <ChatProvider>
          <UserAuth />
          
        <ChatArea />
        </ChatProvider>
      </div>
    </GlobalProvider>
  );
}

export default App;
