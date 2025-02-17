import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ContactDetails.css'

const ContactDetails = ({ show, contact, onClose }) => {
  if (!contact) return null;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{contact.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={contact.avatar} alt={contact.name} className="avatar-img" />
        <p><strong>Phone:</strong> {contact.phone}</p>
        <p><strong>Location:</strong> {contact.location}</p>
        <p><strong>Customer Segment:</strong> {contact.customer}</p>
        <p><strong>Gender:</strong> {contact.gender}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactDetails;
