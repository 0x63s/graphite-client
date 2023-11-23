import { useState, useEffect } from "react";
import { useGlobalContext } from './GlobalContext';

function ContactList() {
    const [contactList, setContactList] = useState([]);
    const [selectedContactId, setSelectedContactId] = useState(null); // New state for tracking selected contact
    const { domain, port, isConnected, token } = useGlobalContext();

    useEffect(() => {
        if (isConnected && token !== "") {
            fetch(`http://${domain}:${port}/users/online`, {
                method: "POST",
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.online && Array.isArray(data.online)) {
                    setContactList(data.online);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    }, [isConnected, token, domain, port]);

    const handleRadioChange = (contactId) => {
        setSelectedContactId(contactId);
    };

    const addDummyContact = () => {
        const newContact = { id: 1, name: "Dummy" };
        setContactList(prevContacts => [...prevContacts, newContact]);
    };

    return (
        <div className="contact-list">
            <ul>
                {contactList.map((contact) => (
                    <li key={contact.id}>
                        <label>
                            <input
                                type="radio"
                                value={contact.id}
                                checked={selectedContactId === contact.id}
                                onChange={() => handleRadioChange(contact.id)}
                            />
                            {contact.name}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={addDummyContact}>Add dummy contact</button>
        </div>
    );
}

export default ContactList;
