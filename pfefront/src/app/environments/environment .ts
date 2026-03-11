export const environment = {
  production: false,
  wsUrl: 'http://localhost:8080/ws', // SockJS endpoint
  stunServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ]
};