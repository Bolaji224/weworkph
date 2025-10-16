import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.REACT_APP_PUSHER_APP_KEY || 'local',
  wsHost: process.env.REACT_APP_PUSHER_HOST || window.location.hostname,
  wsPort: process.env.REACT_APP_PUSHER_PORT ? Number(process.env.REACT_APP_PUSHER_PORT) : 6001,
  wssPort: process.env.REACT_APP_PUSHER_PORT ? Number(process.env.REACT_APP_PUSHER_PORT) : 6001,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  cluster: 'mt1',
  enabledTransports: ['ws', 'wss'],
  authEndpoint: `${process.env.REACT_APP_API_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
});
