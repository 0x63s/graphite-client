import React from "react";
import "./App.css";
import UserAuth from "./components/UserAuth";
import ConnectionBox from "./components/ConnectionBox";
import { GlobalProvider } from "./context/GlobalContext";
import ChatArea from "./components/ChatArea";
import { ChatProvider } from "./context/ChatContext";
//import ContactList from './ContactList';

function App() {
  return (
    <GlobalProvider>
      <div className="App">
        <header className="App-header">
          {/* Other components like ChatArea, ContactList, etc. can be added here as needed */}
        </header>

        {
          // <ContactList />
        }
        <ChatProvider>
          <ConnectionBox />
          <UserAuth />
          <ChatArea />
        </ChatProvider>
      </div>
    </GlobalProvider>
  );
}

export default App;
