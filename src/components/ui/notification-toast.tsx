'use client';

import { useEffect } from 'react';
import { useTogethrStore } from '@/lib/store';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationToast() {
  const { notifications, markNotificationRead } = useTogethrStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    notifications.forEach((notification) => {
      if (!notification.read) {
        const timer = setTimeout(() => {
          markNotificationRead(notification.id);
        }, 5000);
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, markNotificationRead]);

  const visibleNotifications = notifications.filter(n => !n.read).slice(0, 3);

  if (visibleNotifications.length === 0) return null;

  return (
    <>
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .toast-slide-in {
          animation: slideInRight 0.3s ease-out;
        }
        .toast-slide-in-delay-1 {
          animation: slideInRight 0.3s ease-out;
          animation-delay: 0.1s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .toast-slide-in-delay-2 {
          animation: slideInRight 0.3s ease-out;
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {visibleNotifications.map((notification, index) => (
          <div
            key={notification.id}
            className={cn(
              'max-w-sm w-full border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out',
              'transform translate-x-0',
              getToastStyles(notification.type),
              index === 0 ? 'toast-slide-in' : index === 1 ? 'toast-slide-in-delay-1' : 'toast-slide-in-delay-2'
            )}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {notification.title}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => markNotificationRead(notification.id)}
                className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
} 