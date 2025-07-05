import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, addDays, addHours } from 'date-fns';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

const generateMockEvents = () => {
  const categories = ['Technology', 'Business', 'Arts', 'Sports', 'Music', 'Food', 'Education', 'Health'];
  const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA'];
  const eventTypes = ['Conference', 'Workshop', 'Meetup', 'Festival', 'Exhibition', 'Seminar', 'Concert', 'Competition'];
  
  const mockEvents = [];
  
  for (let i = 1; i <= 20; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const startDate = addDays(new Date(), Math.floor(Math.random() * 60));
    const endDate = addHours(startDate, 2 + Math.floor(Math.random() * 6));
    
    mockEvents.push({
      id: i.toString(),
      title: `${category} ${eventType} ${i}`,
      description: `Join us for an amazing ${category.toLowerCase()} ${eventType.toLowerCase()} where you'll learn, network, and have a great time. This event brings together experts and enthusiasts to share knowledge and create lasting connections.`,
      category,
      location,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      price: Math.random() > 0.3 ? Math.floor(Math.random() * 200) + 10 : 0,
      maxAttendees: 50 + Math.floor(Math.random() * 450),
      currentAttendees: Math.floor(Math.random() * 100),
      imageUrl: `https://picsum.photos/400/300?random=${i}`,
      organizerId: 'mock-organizer',
      organizerName: `Organizer ${i}`,
      tags: [category.toLowerCase(), eventType.toLowerCase()],
      createdAt: new Date().toISOString(),
      attendees: [],
      isVirtual: Math.random() > 0.7,
      virtualLink: Math.random() > 0.7 ? 'https://zoom.us/j/example' : null,
    });
  }
  
  return mockEvents;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load events from localStorage or generate mock data
    const storedEvents = localStorage.getItem('eventHub_events');
    const storedUserEvents = localStorage.getItem('eventHub_userEvents');
    const storedAttendedEvents = localStorage.getItem('eventHub_attendedEvents');

    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      const mockEvents = generateMockEvents();
      setEvents(mockEvents);
      localStorage.setItem('eventHub_events', JSON.stringify(mockEvents));
    }

    if (storedUserEvents) {
      setUserEvents(JSON.parse(storedUserEvents));
    }

    if (storedAttendedEvents) {
      setAttendedEvents(JSON.parse(storedAttendedEvents));
    }

    setLoading(false);
  }, []);

  const createEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      currentAttendees: 0,
      attendees: [],
    };

    const updatedEvents = [...events, newEvent];
    const updatedUserEvents = [...userEvents, newEvent];

    setEvents(updatedEvents);
    setUserEvents(updatedUserEvents);

    localStorage.setItem('eventHub_events', JSON.stringify(updatedEvents));
    localStorage.setItem('eventHub_userEvents', JSON.stringify(updatedUserEvents));

    return newEvent;
  };

  const attendEvent = (eventId, userId) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const isAlreadyAttending = event.attendees.includes(userId);
        if (!isAlreadyAttending && event.currentAttendees < event.maxAttendees) {
          return {
            ...event,
            attendees: [...event.attendees, userId],
            currentAttendees: event.currentAttendees + 1,
          };
        }
      }
      return event;
    });

    const attendedEvent = events.find(event => event.id === eventId);
    if (attendedEvent && !attendedEvent.attendees.includes(userId)) {
      const updatedAttendedEvents = [...attendedEvents, attendedEvent];
      setAttendedEvents(updatedAttendedEvents);
      localStorage.setItem('eventHub_attendedEvents', JSON.stringify(updatedAttendedEvents));
    }

    setEvents(updatedEvents);
    localStorage.setItem('eventHub_events', JSON.stringify(updatedEvents));
  };

  const unattendEvent = (eventId, userId) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const isAttending = event.attendees.includes(userId);
        if (isAttending) {
          return {
            ...event,
            attendees: event.attendees.filter(id => id !== userId),
            currentAttendees: Math.max(0, event.currentAttendees - 1),
          };
        }
      }
      return event;
    });

    const updatedAttendedEvents = attendedEvents.filter(event => event.id !== eventId);
    setAttendedEvents(updatedAttendedEvents);
    localStorage.setItem('eventHub_attendedEvents', JSON.stringify(updatedAttendedEvents));

    setEvents(updatedEvents);
    localStorage.setItem('eventHub_events', JSON.stringify(updatedEvents));
  };

  const getEventById = (id) => {
    return events.find(event => event.id === id);
  };

  const searchEvents = (query, filters = {}) => {
    let filteredEvents = events;

    if (query) {
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.category.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.category) {
      filteredEvents = filteredEvents.filter(event => event.category === filters.category);
    }

    if (filters.location) {
      filteredEvents = filteredEvents.filter(event => event.location === filters.location);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filteredEvents = filteredEvents.filter(event => event.price >= min && event.price <= max);
    }

    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate >= startDate && eventDate <= endDate;
      });
    }

    return filteredEvents;
  };

  const value = {
    events,
    userEvents,
    attendedEvents,
    loading,
    createEvent,
    attendEvent,
    unattendEvent,
    getEventById,
    searchEvents,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};