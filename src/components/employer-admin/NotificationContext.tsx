import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { httpGetWithToken } from "../../utils/http_utils";
import { iProfileCompany } from "../../models/profle";
import { AppContext } from "../../global/state";

interface iContext {
  user?: iProfileCompany;
}

interface Notification {
  id: number;
  applicantName: string;
  jobTitle: string;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: number) => void;
  refreshNotifications: () => void;
}

const STORAGE_KEY = "employer_read_notification_ids";

// Persist read IDs in localStorage so they survive page refresh
const getReadIds = (): Set<number> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveReadIds = (ids: Set<number>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([ids]));
  } catch {}
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAllAsRead: () => {},
  markAsRead: () => {},
  refreshNotifications: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const readIdsRef = useRef<Set<number>>(getReadIds());
  const { user }: iContext = useContext(AppContext);

  const fetchAndBuild = useCallback(async () => {
    try {
      const response = await httpGetWithToken("employer/applications");
      const applications: any[] = response.data || [];

      console.log("Raw applications from API:", applications); // 🔍 debug

      // Build notifications from ALL applicants.
      // Mark as unread only if not in persisted read set.
      const built: Notification[] = applications.map((app: any) => ({
        id: app.id,
        applicantName: user?.name || app.applicant?.name || "Unknown",
        jobTitle: app.job?.title || "Unknown Job",
        timestamp: app.created_at || new Date().toISOString(),
        read: readIdsRef.current.has(app.id),
      }));

      // Sort newest first
      built.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      console.log("Built notifications:", built); // 🔍 debug

      setNotifications(built);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  }, []);

  // Poll every 30 seconds
  useEffect(() => {
    fetchAndBuild();
    const interval = setInterval(fetchAndBuild, 30_000);
    return () => clearInterval(interval);
  }, [fetchAndBuild]);

  const markAsRead = (id: number) => {
    readIdsRef.current.add(id);
    saveReadIds(readIdsRef.current);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    notifications.forEach((n) => readIdsRef.current.add(n.id));
    saveReadIds(readIdsRef.current);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
        refreshNotifications: fetchAndBuild,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};