import { useState, useEffect } from "react";

import { useGlobalContext } from './GlobalContext';

const { domain, port } = useGlobalContext();

function ContactList() {
    const [contactList, setContactList] = useState([]);

    useEffect(() => {
        // Check if the user is logged in
        const isLoggedIn = true; // Replace with your login check logic

        if (isLoggedIn) {
            // Make a POST request to the /users/online endpoint with the global domain and port
            fetch(`http://${domain}:${port}/users/online`, {
                method: "POST",
            })
                .then((response) => response.json())
                .then((data) => {
                    // Check if the response contains an "online" array
                    if (data.online && Array.isArray(data.online)) {
                        // Update the contact list with the new data
                        setContactList(data.online);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, []);

    return (
        <>
            <div className="contact-list">
                <ul>
                    {/* Dynamically populate list items */}
                    {contactList.map((contact) => (
                        <li key={contact.id}>{contact.name}</li>
                    ))}
                </ul>
            </div>
        </>
    );
}