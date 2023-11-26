import { useState, useEffect } from "react";
import { useGlobalContext } from '../../context/GlobalContext';
import styles from "./ContactList.module.css";

function ContactList() {
    const [contactList, setContactList] = useState([]);
    const [selectedContactIndex, setSelectedContactIndex] = useState(); // New state for tracking selected contact
    const { domain, port, isConnected, token, conversations } = useGlobalContext();

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

    const handleRadioChange = (index) => {
        //setSelectedContactIndex(index);
    };

    return (
        <div className={styles["contact-list"]}> {/* Use styles object for class */}
            <ul>
                {conversations.map((conversation, index) => (
                    <li key={index} className={styles["contact-item"]}> {/* Add class for li if needed */}
                        <input
                            id={`contact-${index}`} // Unique ID for the input
                            type="radio"
                            name="contact"
                            value={index}
                            onChange={() => handleRadioChange(index)}
                            className={styles["contact-radio"]} // Use styles object for class
                        />
                        <label htmlFor={`contact-${index}`} className={styles["contact-label"]}> {/* Use styles object for class */}
                            {conversation.name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ContactList;
