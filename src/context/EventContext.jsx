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

    // Generate mock media for some events
    const hasMedia = Math.random() > 0.5;
    const mediaCount = hasMedia ? Math.floor(Math.random() * 4) + 1 : 0;
    const media = [];
    
    for (let j = 0; j < mediaCount; j++) {
      const isVideo = Math.random() > 0.7;
      media.push({
        id: `media_${i}_${j}`,
        url: isVideo 
          ? `https://sample-videos.com/zip/10/mp4/480/sample_${j + 1}.mp4`
          : `https://picsum.photos/800/600?random=${i}_${j}`,
        type: isVideo ? 'video' : 'image',
        name: isVideo ? `Video ${j + 1}.mp4` : `Image ${j + 1}.jpg`,
        isPrimary: j === 0,
        order: j,
        thumbnail: isVideo ? `https://picsum.photos/400/300?random=${i}_${j}_thumb` : null
      });
    }

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
      comments: [],
      media: media
    });
  }

  return mockEvents;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load events from localStorage or generate mock data
    const storedEvents = localStorage.getItem('sierraHub_events');
    const storedUserEvents = localStorage.getItem('sierraHub_userEvents');
    const storedAttendedEvents = localStorage.getItem('sierraHub_attendedEvents');
    const storedSavedEvents = localStorage.getItem('sierraHub_savedEvents');

    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      const mockEvents = generateMockEvents();
      setEvents(mockEvents);
      localStorage.setItem('sierraHub_events', JSON.stringify(mockEvents));
    }

    if (storedUserEvents) {
      setUserEvents(JSON.parse(storedUserEvents));
    }

    if (storedAttendedEvents) {
      setAttendedEvents(JSON.parse(storedAttendedEvents));
    }

    if (storedSavedEvents) {
      setSavedEvents(JSON.parse(storedSavedEvents));
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
      comments: [],
    };

    const updatedEvents = [...events, newEvent];
    const updatedUserEvents = [...userEvents, newEvent];

    setEvents(updatedEvents);
    setUserEvents(updatedUserEvents);

    localStorage.setItem('sierraHub_events', JSON.stringify(updatedEvents));
    localStorage.setItem('sierraHub_userEvents', JSON.stringify(updatedUserEvents));

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
      localStorage.setItem('sierraHub_attendedEvents', JSON.stringify(updatedAttendedEvents));
    }

    setEvents(updatedEvents);
    localStorage.setItem('sierraHub_events', JSON.stringify(updatedEvents));
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
    localStorage.setItem('sierraHub_attendedEvents', JSON.stringify(updatedAttendedEvents));

    setEvents(updatedEvents);
    localStorage.setItem('sierraHub_events', JSON.stringify(updatedEvents));
  };

  // Enhanced Saved Events Functions
  const saveEvent = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event && !savedEvents.find(saved => saved.id === eventId)) {
      const savedEvent = {
        ...event,
        savedAt: new Date().toISOString()
      };
      const updatedSavedEvents = [...savedEvents, savedEvent];
      setSavedEvents(updatedSavedEvents);
      localStorage.setItem('sierraHub_savedEvents', JSON.stringify(updatedSavedEvents));

      // Show success feedback (could be a toast notification)
      console.log(`Event "${event.title}" saved successfully!`);
      return true;
    }
    return false;
  };

  const unsaveEvent = (eventId) => {
    const event = savedEvents.find(e => e.id === eventId);
    const updatedSavedEvents = savedEvents.filter(event => event.id !== eventId);
    setSavedEvents(updatedSavedEvents);
    localStorage.setItem('sierraHub_savedEvents', JSON.stringify(updatedSavedEvents));

    // Show success feedback
    if (event) {
      console.log(`Event "${event.title}" removed from saved events!`);
    }
    return true;
  };

  const isEventSaved = (eventId) => {
    return savedEvents.some(event => event.id === eventId);
  };

  const clearAllSavedEvents = () => {
    setSavedEvents([]);
    localStorage.removeItem('sierraHub_savedEvents');
    console.log('All saved events cleared!');
  };

  const getSavedEventsCount = () => {
    return savedEvents.length;
  };

  const getSavedEventsByCategory = (category) => {
    return savedEvents.filter(event => event.category === category);
  };

  // Comment System Functions
  const addComment = (eventId, comment) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          comments: [...(event.comments || []), comment]
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    localStorage.setItem('sierraHub_events', JSON.stringify(updatedEvents));
  };

  const replyToComment = (eventId, commentId, reply) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const updatedComments = event.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply]
            };
          }
          return comment;
        });
        return { ...event, comments: updatedComments };
      }
      return event;
    });

    setEvents(updatedEvents);
    localStorage.setItem('sierraHub_events', JSON.stringify(updatedEvents));
  };

  const reactToComment = (eventId, commentId, reactionId, userId, isReply = false, parentId = null) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const updatedComments = event.comments.map(comment => {
          if (isReply && comment.id === parentId) {
            const updatedReplies = comment.replies.map(reply => {
              if (reply.id === commentId) {
                const reactions = { ...reply.reactions };
                // Remove user from all reactions first
                Object.keys(reactions).forEach(key => {
                  reactions[key] = reactions[key].filter(id => id !== userId);
                });
                // Add user to the new reaction (toggle off if same reaction)
                if (!reactions[reactionId]) reactions[reactionId] = [];
                const hasReaction = reply.reactions?.[reactionId]?.includes(userId);
                if (!hasReaction) {
                  reactions[reactionId] = [...reactions[reactionId], userId];
                }
                return { ...reply, reactions };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          } else if (!isReply && comment.id === commentId) {
            const reactions = { ...comment.reactions };
            // Remove user from all reactions first
            Object.keys(reactions).forEach(key => {
              reactions[key] = reactions[key].filter(id => id !== userId);
            });
            // Add user to the new reaction (toggle off if same reaction)
            if (!reactions[reactionId]) reactions[reactionId] = [];
            const hasReaction = comment.reactions?.[reactionId]?.includes(userId);
            if (!hasReaction) {
              reactions[reactionId] = [...reactions[reactionId], userId];
            }
            return { ...comment, reactions };
          }
          return comment;
        });
        return { ...event, comments: updatedComments };
      }
      return event;
    });

    setEvents(updatedEvents);
    localStorage.setItem('sierraHub_events', JSON.stringify(updatedEvents));
  };

  const editComment = (eventId, commentId, newContent) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const updatedComments = event.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              content: newContent,
              isEdited: true
            };
          }
          return comment;
        });
        return { ...event, comments: updatedComments };
      }
      return event;
    });

    setEvents(updatedEvents);
    localStorage.setItem('sierraHub_events', JSON.stringify(updatedEvents));
  };

  const deleteComment = (eventId, commentId) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const updatedComments = event.comments.filter(comment => comment.id !== commentId);
        return { ...event, comments: updatedComments };
      }
      return event;
    });

    setEvents(updatedEvents);
    localStorage.setItem('sierraHub_events', JSON.stringify(updatedEvents));
  };

  const reportComment = (eventId, commentId) => {
    // Mock report functionality
    console.log(`Reported comment ${commentId} in event ${eventId}`);
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
    savedEvents,
    loading,
    createEvent,
    attendEvent,
    unattendEvent,
    getEventById,
    searchEvents,
    // Enhanced saved events functions
    saveEvent,
    unsaveEvent,
    isEventSaved,
    clearAllSavedEvents,
    getSavedEventsCount,
    getSavedEventsByCategory,
    // Comment functions
    addComment,
    replyToComment,
    reactToComment,
    editComment,
    deleteComment,
    reportComment,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};