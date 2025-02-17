import React, { useState } from 'react';
import './WhatsappDashboard.css';
import ContactDetails from './ContactDetails';
import { Modal, Button } from 'react-bootstrap';

const WhatsappDashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState(''); // State for broadcast message
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false); // State for broadcast modal
  const [broadcastHistory, setBroadcastHistory] = useState([]); // State for broadcast history

  const [newContact, setNewContact] = useState({
    name: '',
    phoneNumber: '',
    location: '',
    customer: '',
    gender: '',
    avatarFile: null,
  });

  const handleAddContact = (e) => {
    e.preventDefault();
    const contact = {
      id: Date.now(),
      ...newContact,
      avatar: newContact.avatarFile
        ? URL.createObjectURL(newContact.avatarFile)
        : 'https://via.placeholder.com/40',
      lastMessage: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      online: false,
      messages: []
    };
    setContacts([...contacts, contact]);
    setNewContact({ name: '', phoneNumber: '', location: '', customer: '', gender: '', avatarFile: null });
    setIsAddContactModalOpen(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const newMsg = {
        text: newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Send message to WhatsApp API through backend
    try {
        await sendMessageToWhatsappAPI(selectedContact.phoneNumber, newMessage); // Call API function
    } catch (error) {
        console.error("Error sending message to WhatsApp:", error);
    }

    const updatedContacts = contacts.map(contact => {
      if (contact.id === selectedContact.id) {
        return {
          ...contact,
          messages: [...contact.messages, newMsg],
          timestamp: newMsg.time,
          lastMessage: newMsg.text
        };
      }
      return contact;
    });

    setContacts(updatedContacts);
    setSelectedContact(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      timestamp: newMsg.time,
      lastMessage: newMsg.text
    }));
    setNewMessage('');
  };

  // Function to call backend to send a message to WhatsApp
  const sendMessageToWhatsappAPI = async (phoneNumber, message) => {
    try {
      const response = await fetch('http://localhost:3001/api/whatsapp/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, message })
      });
      if (!response.ok) throw new Error('Failed to send message to WhatsApp');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (!isSelectionMode) {
      setSelectedContacts([]); // Clear selected contacts when exiting selection mode
    }
  };

  const handleContactSelect = (contactId) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId)); // Deselect
    } else {
      setSelectedContacts([...selectedContacts, contactId]); // Select
    }
  };

  const handleBroadcast = async () => {
    if (selectedContacts.length === 0 || !broadcastMessage.trim()) return;

    const broadcastMsg = {
        text: broadcastMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
        await sendBroadcastToWhatsappAPI(selectedContacts, broadcastMessage); // Broadcast API call
    } catch (error) {
        console.error("Error sending broadcast to WhatsApp:", error);
    }

    // Update contacts with the broadcast message
    const updatedContacts = contacts.map(contact => {
      if (selectedContacts.includes(contact.id)) {
        return {
          ...contact,
          messages: [...contact.messages, broadcastMsg],
          timestamp: broadcastMsg.time,
          lastMessage: broadcastMsg.text
        };
      }
      return contact;
    });

    setContacts(updatedContacts);

    // Add to broadcast history
    setBroadcastHistory(prevHistory => [
      ...prevHistory,
      {
        message: broadcastMessage,
        time: broadcastMsg.time,
        recipients: selectedContacts.map(id => contacts.find(contact => contact.id === id).name),
      }
    ]);

    setBroadcastMessage(''); // Clear broadcast message input
    setSelectedContacts([]); // Clear selected contacts
    setIsBroadcastModalOpen(false); // Close the broadcast modal
  };

  // Function to call backend to send a broadcast message to WhatsApp
const sendBroadcastToWhatsappAPI = async (selectedContacts, message) => {
  try {
      const response = await fetch('http://localhost:3001/api/whatsapp/send-broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              contacts: selectedContacts,
              message: message
          })
      });
      if (!response.ok) {
          throw new Error('Failed to send broadcast message');
      }
  } catch (error) {
      console.error('Error sending broadcast:', error);
      throw error;
  }
};

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumber.includes(searchQuery) ||
    (contact.gender && contact.gender.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (contact.location && contact.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="messaging-container">
      <div className="freeheader">
        <header>Chats</header>
        <div className="options-menu-container">
          <button 
            className="ellipsis-button"
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
          >
            ⋮
          </button>
          
          {showOptionsMenu && (
            <div className="options-menu">
              <button 
                className="menu-item"
                onClick={() => {
                  setIsAddContactModalOpen(true);
                  setShowOptionsMenu(false);
                }}
              >
                Add New Contact
              </button>
              <button 
                className="menu-item"
                onClick={() => {
                  toggleSelectionMode();
                  setShowOptionsMenu(false);
                  setIsBroadcastModalOpen(true); // Open broadcast modal
                }}
              >
                {isSelectionMode ? 'Cancel Selection' : 'Select Contacts'}
              </button>
              <button 
                className="menu-item"
                onClick={() => {
                  setShowOptionsMenu(false);
                  setIsBroadcastModalOpen(true); // Open broadcast modal
                }}
                disabled={selectedContacts.length === 0} // Disable if no contacts are selected
              >
                Broadcast
              </button>
              <button 
                className="menu-item"
                onClick={() => {
                  setShowOptionsMenu(false);
                  // Open broadcast history modal
                }}
              >
                Broadcast History
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="subcontainer">
        <div className="contacts-list">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="contacts-scrollable">
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                className="contact-item" 
                onClick={() => {
                  if (!isSelectionMode) {
                    setSelectedContact(contact);
                  }
                }}
              >
                {isSelectionMode && (
                  <div 
                    className="selection-circle"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent contact selection
                      handleContactSelect(contact.id);
                    }}
                  >
                    {selectedContacts.includes(contact.id) && (
                      <div className="selected-indicator" />
                    )}
                  </div>
                )}
                <div className="avatar-container">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="avatar"
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsDetailModalOpen(true);
                    }}
                  />
                  {contact.online && <div className="online-indicator" />}
                </div>
                <div className="contact-info">
                  <div className="contact-header">
                    <h3 className="contact-name">{contact.name}</h3>
                    <span className="timestamp">{contact.timestamp}</span>
                  </div>
                  <p className="contact-phone">{contact.phoneNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-container">
          {selectedContact ? (
            <div className="chat-window">
              <div className="chat-header">
                <img src={selectedContact.avatar} alt={selectedContact.name} className="chat-avatar" />
                <div>
                  <h3>{selectedContact.name}</h3>
                  <p className="chat-phone">{selectedContact.phoneNumber}</p>
                </div>
              </div>
              <div className="chat-messages">
                {selectedContact.messages.length > 0 ? (
                  selectedContact.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message-box ${msg.sender === 'me' ? 'sent' : 'received'}`}
                    >
                      <p className="message-text">{msg.text}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-chat">Start chatting with {selectedContact.name}</div>
                )}
              </div>
              <div className="chat-input-container">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          ) : (
            <div className="empty-chat">Select a contact to start chatting</div>
          )}
        </div>
      </div>

      {/* Broadcast Modal */}
      <Modal show={isBroadcastModalOpen} onHide={() => setIsBroadcastModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Broadcast Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="Type your broadcast message..."
            rows={4}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsBroadcastModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBroadcast}>
            Send Broadcast
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Broadcast History Modal */}
      <Modal show={broadcastHistory.length > 0} onHide={() => setBroadcastHistory([])}>
        <Modal.Header closeButton>
          <Modal.Title>Broadcast History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {broadcastHistory.map((broadcast, index) => (
            <div key={index} className="broadcast-history-item">
              <p><strong>Message:</strong> {broadcast.message}</p>
              <p><strong>Time:</strong> {broadcast.time}</p>
              <p><strong>Recipients:</strong> {broadcast.recipients.join(', ')}</p>
              <hr />
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setBroadcastHistory([])}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isAddContactModalOpen} onHide={() => setIsAddContactModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddContact}>
            {['name', 'phoneNumber', 'location', 'customer'].map((field) => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  value={newContact[field]}
                  onChange={(e) => setNewContact({ ...newContact, [field]: e.target.value })}
                  required
                />
              </div>
            ))}
            <div className="form-group">
              <label>Gender</label>
              <select
                value={newContact.gender}
                onChange={(e) => setNewContact({ ...newContact, gender: e.target.value })}
                required
              >
                <option value="">-- Select --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Business Organisation</option>
              </select>
            </div>
            <div className="form-group">
              <label>Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewContact({ ...newContact, avatarFile: e.target.files[0] })}
              />
            </div>
            <Button variant="primary" type="submit">Add Contact</Button>
          </form>
        </Modal.Body>
      </Modal>

      <ContactDetails show={isDetailModalOpen} contact={selectedContact} onClose={() => setIsDetailModalOpen(false)} />
    </div>
  );
};

export default WhatsappDashboard;