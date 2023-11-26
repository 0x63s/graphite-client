import React from "react";
import "./App.css";
import UserAuth from "./components/UserAuth";
import ConnectionBox from "./components/ConnectionBox";
import { GlobalProvider } from "./context/GlobalContext";
import ChatArea from "./components/ChatArea";
import { ChatProvider } from "./context/ChatContext";
import ContactList from "./components/ContactList";
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

//import ContactList from './ContactList';

function App() {
  return (
      <div className="App">     
        <header className="App-header">
          {/* Other components like ChatArea, ContactList, etc. can be added here as needed */}
        </header>


        <GlobalProvider>
          
      <ReactNotifications />   
        <ChatProvider>
          {
            //<ContactList />
          }
          <ConnectionBox />
          <UserAuth />
          <ChatArea />
        </ChatProvider>
    </GlobalProvider>
      </div>
  );
}

export default App;
