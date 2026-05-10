import React, { createContext, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        if (user) {
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl('http://localhost:8080/eventhub', {
                    accessTokenFactory: () => localStorage.getItem('token')
                })
                .withAutomaticReconnect()
                .build();

            setConnection(newConnection);
        } else {
            if (connection) {
                connection.stop();
                setConnection(null);
            }
        }
    }, [user]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('SignalR Connected');
                    
                    connection.on('NewNotification', (notification) => {
                        setNotifications(prev => [notification, ...prev]);
                        // Show a more descriptive alert or toast
                        console.log("New Notification:", notification);
                    });

                    connection.on('SystemNotification', (notification) => {
                        setNotifications(prev => [{
                            id: Date.now(),
                            title: notification.title,
                            message: notification.message,
                            type: notification.type,
                            createdAt: notification.timestamp
                        }, ...prev]);
                    });

                    connection.on('ReceiveNotification', (message) => { // Keep for backward compatibility if needed
                        setNotifications(prev => [{ id: Date.now(), message, read: false }, ...prev]);
                    });
                })
                .catch(err => console.error('SignalR Connection Error: ', err));
        }
    }, [connection]);

    const [toasts, setToasts] = useState([]);

    const addNotification = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, toasts, addNotification, removeToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <div 
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-fadeIn ${
                            toast.type === 'success' 
                            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                            : toast.type === 'error'
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        }`}
                    >
                        {toast.type === 'success' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                        {toast.type === 'error' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                        <p className="text-sm font-bold">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-50 transition-opacity">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
