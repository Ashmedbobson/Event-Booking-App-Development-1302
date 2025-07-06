import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiMinus, FiTrash2, FiEdit, FiTicket, FiUsers, FiDollarSign, FiInfo } = FiIcons;

const TicketTypeSelector = ({ ticketTypes, onTicketTypesChange, eventPrice }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 100,
    benefits: [],
    isLimited: false
  });

  const defaultTicketTypes = [
    { name: 'General Admission', description: 'Standard event access', benefits: ['Event access', 'Basic seating'] },
    { name: 'VIP', description: 'Premium experience', benefits: ['Priority seating', 'Welcome drink', 'VIP lounge access'] },
    { name: 'Early Bird', description: 'Limited time discount', benefits: ['Discounted price', 'Event access'] },
    { name: 'Student', description: 'Discounted student rate', benefits: ['Student discount', 'Event access'] },
    { name: 'Group (5+)', description: 'Group discount for 5+ people', benefits: ['Group discount', 'Reserved seating'] }
  ];

  const handleAddTicket = () => {
    if (!newTicket.name.trim()) return;

    const ticket = {
      id: Date.now().toString(),
      ...newTicket,
      benefits: newTicket.benefits.filter(b => b.trim()),
      sold: 0,
      available: newTicket.quantity
    };

    onTicketTypesChange([...ticketTypes, ticket]);
    setNewTicket({
      name: '',
      description: '',
      price: 0,
      quantity: 100,
      benefits: [],
      isLimited: false
    });
    setShowAddForm(false);
  };

  const handleEditTicket = (ticketId, updatedTicket) => {
    const updated = ticketTypes.map(ticket =>
      ticket.id === ticketId ? { ...ticket, ...updatedTicket } : ticket
    );
    onTicketTypesChange(updated);
    setEditingTicket(null);
  };

  const handleDeleteTicket = (ticketId) => {
    const updated = ticketTypes.filter(ticket => ticket.id !== ticketId);
    onTicketTypesChange(updated);
  };

  const addBenefit = (benefits, setBenefits) => {
    setBenefits([...benefits, '']);
  };

  const updateBenefit = (benefits, setBenefits, index, value) => {
    const updated = [...benefits];
    updated[index] = value;
    setBenefits(updated);
  };

  const removeBenefit = (benefits, setBenefits, index) => {
    const updated = benefits.filter((_, i) => i !== index);
    setBenefits(updated);
  };

  const addPresetTicket = (preset) => {
    const ticket = {
      id: Date.now().toString(),
      name: preset.name,
      description: preset.description,
      price: eventPrice * (preset.name === 'Early Bird' ? 0.8 : preset.name === 'Student' ? 0.7 : preset.name === 'VIP' ? 1.5 : preset.name === 'Group (5+)' ? 0.85 : 1),
      quantity: 100,
      benefits: preset.benefits,
      isLimited: preset.name === 'Early Bird',
      sold: 0,
      available: 100
    };

    onTicketTypesChange([...ticketTypes, ticket]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Ticket Types</h3>
          <p className="text-sm text-gray-600">Create different ticket types with varying prices and benefits</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>Add Ticket Type</span>
        </button>
      </div>

      {/* Preset Ticket Types */}
      {ticketTypes.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-3">Quick Start - Add Common Ticket Types:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {defaultTicketTypes.map((preset) => (
              <button
                key={preset.name}
                onClick={() => addPresetTicket(preset)}
                className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 transition-colors"
              >
                <div className="font-medium text-blue-800">{preset.name}</div>
                <div className="text-xs text-blue-600">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Existing Ticket Types */}
      <div className="space-y-4">
        <AnimatePresence>
          {ticketTypes.map((ticket, index) => (
            <TicketTypeCard
              key={ticket.id}
              ticket={ticket}
              index={index}
              onEdit={() => setEditingTicket(ticket.id)}
              onDelete={() => handleDeleteTicket(ticket.id)}
              isEditing={editingTicket === ticket.id}
              onSave={(updatedTicket) => handleEditTicket(ticket.id, updatedTicket)}
              onCancelEdit={() => setEditingTicket(null)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && (
          <TicketTypeForm
            ticket={newTicket}
            setTicket={setNewTicket}
            onSave={handleAddTicket}
            onCancel={() => setShowAddForm(false)}
            title="Add New Ticket Type"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const TicketTypeCard = ({ ticket, index, onEdit, onDelete, isEditing, onSave, onCancelEdit }) => {
  const [editForm, setEditForm] = useState({ ...ticket });

  const handleSave = () => {
    onSave(editForm);
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const formatPriceSLL = (price) => {
    return price === 0 ? 'Free' : `Le ${(price * 22000).toLocaleString()}`;
  };

  if (isEditing) {
    return (
      <TicketTypeForm
        ticket={editForm}
        setTicket={setEditForm}
        onSave={handleSave}
        onCancel={onCancelEdit}
        title="Edit Ticket Type"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-gray-200 rounded-lg p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <SafeIcon icon={FiTicket} className="h-5 w-5 text-primary-600" />
            <h4 className="font-semibold text-gray-800">{ticket.name}</h4>
            {ticket.isLimited && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                Limited
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
            <div>
              <div className="text-lg font-bold text-gray-800">{formatPrice(ticket.price)}</div>
              <div className="text-sm text-gray-600">{formatPriceSLL(ticket.price)}</div>
            </div>
            
            <div>
              <div className="text-lg font-bold text-gray-800">{ticket.available}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            
            <div>
              <div className="text-lg font-bold text-gray-800">{ticket.sold || 0}</div>
              <div className="text-sm text-gray-600">Sold</div>
            </div>
          </div>

          {ticket.benefits && ticket.benefits.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Benefits:</h5>
              <ul className="list-disc list-inside space-y-1">
                {ticket.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-sm text-gray-600">{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit ticket type"
          >
            <SafeIcon icon={FiEdit} className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete ticket type"
          >
            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TicketTypeForm = ({ ticket, setTicket, onSave, onCancel, title }) => {
  const addBenefit = () => {
    setTicket(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), '']
    }));
  };

  const updateBenefit = (index, value) => {
    setTicket(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  const removeBenefit = (index) => {
    setTicket(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-50 border border-gray-200 rounded-lg p-6"
    >
      <h4 className="font-semibold text-gray-800 mb-4">{title}</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ticket Name *
          </label>
          <input
            type="text"
            value={ticket.name}
            onChange={(e) => setTicket(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., General Admission, VIP"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD) *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={ticket.price}
            onChange={(e) => setTicket(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">
            ≈ Le {((ticket.price || 0) * 22000).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={ticket.description}
            onChange={(e) => setTicket(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Brief description of this ticket type"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Quantity
          </label>
          <input
            type="number"
            min="1"
            value={ticket.quantity}
            onChange={(e) => setTicket(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="100"
          />
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Benefits/Features
        </label>
        <div className="space-y-2">
          {(ticket.benefits || []).map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateBenefit(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Priority seating, Welcome drink"
              />
              <button
                onClick={() => removeBenefit(index)}
                className="p-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <SafeIcon icon={FiMinus} className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addBenefit}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="h-4 w-4" />
            <span className="text-sm">Add benefit</span>
          </button>
        </div>
      </div>

      {/* Limited Time */}
      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={ticket.isLimited}
            onChange={(e) => setTicket(prev => ({ ...prev, isLimited: e.target.checked }))}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">This is a limited-time or limited-quantity ticket</span>
        </label>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onSave}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Save Ticket Type
        </button>
        <button
          onClick={onCancel}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default TicketTypeSelector;