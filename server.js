const { createServer } = require('node:http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// ─── Simulated Rider Movement ──────────────────────────────────────────────
// In production, this would come from actual GPS devices.

const WAREHOUSE = { lat: -25.7479, lng: 28.2293 };

const simulatedRiders = [
  { id: 'rider-1', name: 'Sipho M.', lat: -25.7455, lng: 28.2301, status: 'ONLINE', vehicle: 'BIKE' },
  { id: 'rider-2', name: 'Thabo N.', lat: -25.7492, lng: 28.2362, status: 'ONLINE', vehicle: 'SMALL_TRUCK' },
  { id: 'rider-3', name: 'Lerato D.', lat: -25.7420, lng: 28.2248, status: 'BUSY', vehicle: 'BIKE' },
  { id: 'rider-4', name: 'Kgosi S.', lat: -25.7511, lng: 28.2197, status: 'ONLINE', vehicle: 'CARGO_TRUCK' },
  { id: 'rider-5', name: 'Nokuthula K.', lat: -25.7481, lng: 28.2338, status: 'ONLINE', vehicle: 'BIKE' },
  { id: 'rider-6', name: 'Kgomotso M.', lat: -25.7459, lng: 28.2284, status: 'OFFLINE', vehicle: 'SMALL_TRUCK' },
  { id: 'rider-7', name: 'Lebohang M.', lat: -25.7535, lng: 28.2322, status: 'ONLINE', vehicle: 'CARGO_TRUCK' },
  { id: 'rider-8', name: 'Mandisa S.', lat: -25.7470, lng: 28.2370, status: 'ONLINE', vehicle: 'BIKE' },
];

function simulateRiderMovement(rider) {
  if (rider.status === 'OFFLINE') return;
  // Random walk within ~200m
  const jitter = 0.002;
  rider.lat += (Math.random() - 0.5) * jitter;
  rider.lng += (Math.random() - 0.5) * jitter;
}

// ─── Server Setup ──────────────────────────────────────────────────────────

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['websocket', 'polling'],
  });

  // Track connected clients
  let connectedClients = 0;

  io.on('connection', (socket) => {
    connectedClients++;
    console.log(`[WS] Client connected: ${socket.id} (total: ${connectedClients})`);

    // Send initial rider positions
    socket.emit('riders:initial', simulatedRiders);

    // Handle rider location updates (from rider apps)
    socket.on('rider:location', (data) => {
      const { riderId, lat, lng } = data;
      const rider = simulatedRiders.find((r) => r.id === riderId);
      if (rider) {
        rider.lat = lat;
        rider.lng = lng;
      }
      // Broadcast to all clients
      io.emit('rider:location', { riderId, lat, lng, timestamp: Date.now() });
    });

    // Handle rider status changes
    socket.on('rider:status', (data) => {
      const { riderId, status } = data;
      const rider = simulatedRiders.find((r) => r.id === riderId);
      if (rider) rider.status = status;
      io.emit('rider:status', { riderId, status, timestamp: Date.now() });
    });

    // Handle order events
    socket.on('order:created', (data) => {
      io.emit('order:created', { ...data, timestamp: Date.now() });
    });

    socket.on('order:updated', (data) => {
      io.emit('order:updated', { ...data, timestamp: Date.now() });
    });

    socket.on('order:assigned', (data) => {
      io.emit('order:assigned', { ...data, timestamp: Date.now() });
    });

    // Handle route optimization requests
    socket.on('route:optimize', (data) => {
      // Broadcast optimized route to relevant clients
      io.emit('route:updated', { ...data, timestamp: Date.now() });
    });

    // Handle failure alerts
    socket.on('alert:failure', (data) => {
      io.emit('alert:failure', { ...data, timestamp: Date.now() });
    });

    socket.on('disconnect', () => {
      connectedClients--;
      console.log(`[WS] Client disconnected: ${socket.id} (total: ${connectedClients})`);
    });
  });

  // ─── Periodic Rider Position Simulation ────────────────────────────────
  // Simulate rider movement every 3 seconds
  setInterval(() => {
    simulatedRiders.forEach((rider) => {
      simulateRiderMovement(rider);
    });

    // Broadcast updated positions
    const locationUpdates = simulatedRiders
      .filter((r) => r.status !== 'OFFLINE')
      .map((r) => ({
        riderId: r.id,
        name: r.name,
        lat: r.lat,
        lng: r.lng,
        status: r.status,
        vehicle: r.vehicle,
        timestamp: Date.now(),
      }));

    io.emit('riders:positions', locationUpdates);
  }, 3000);

  // ─── Periodic Stats Broadcast ──────────────────────────────────────────
  setInterval(() => {
    const onlineRiders = simulatedRiders.filter((r) => r.status !== 'OFFLINE').length;
    io.emit('stats:updated', {
      connectedClients,
      onlineRiders,
      totalRiders: simulatedRiders.length,
      timestamp: Date.now(),
    });
  }, 10000);

  httpServer
    .once('error', (err) => {
      console.error('[Server] Error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`\n  ⚡ SwiftChain server ready`);
      console.log(`  🌐 http://${hostname}:${port}`);
      console.log(`  📡 WebSocket server active`);
      console.log(`  🏍️  Simulating ${simulatedRiders.length} riders\n`);
    });
});
