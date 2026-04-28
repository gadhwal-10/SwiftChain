import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Pretoria area coordinates for realistic seed data
const WAREHOUSE = {
  name: 'Tshwane Dispatch Hub',
  latitude: -25.7479,
  longitude: 28.2293,
  address: 'Pretoria CBD, Pretoria, South Africa',
};

const RIDERS = [
  { name: 'Sipho M.', phone: '+27831234567', vehicleType: 'BIKE' as const, lat: -25.7455, lng: 28.2301, rating: 4.8 },
  { name: 'Thabo N.', phone: '+27839876543', vehicleType: 'SMALL_TRUCK' as const, lat: -25.7492, lng: 28.2362, rating: 4.9 },
  { name: 'Lerato D.', phone: '+27831122334', vehicleType: 'BIKE' as const, lat: -25.7420, lng: 28.2248, rating: 4.5 },
  { name: 'Kgosi S.', phone: '+27834455667', vehicleType: 'CARGO_TRUCK' as const, lat: -25.7511, lng: 28.2197, rating: 4.7 },
  { name: 'Nokuthula K.', phone: '+27831299887', vehicleType: 'BIKE' as const, lat: -25.7481, lng: 28.2338, rating: 4.6 },
  { name: 'Kgomotso M.', phone: '+27831245678', vehicleType: 'SMALL_TRUCK' as const, lat: -25.7459, lng: 28.2284, rating: 4.4 },
  { name: 'Lebohang M.', phone: '+27831299900', vehicleType: 'CARGO_TRUCK' as const, lat: -25.7535, lng: 28.2322, rating: 4.3 },
  { name: 'Mandisa S.', phone: '+27839871234', vehicleType: 'BIKE' as const, lat: -25.7470, lng: 28.2370, rating: 4.9 },
  { name: 'Sibusiso Z.', phone: '+27832344556', vehicleType: 'SMALL_TRUCK' as const, lat: -25.7444, lng: 28.2210, rating: 4.2 },
  { name: 'Nandi K.', phone: '+27831111222', vehicleType: 'BIKE' as const, lat: -25.7508, lng: 28.2251, rating: 4.8 },
];

const DELIVERY_LOCATIONS = [
  { area: 'Hatfield', lat: -25.7474, lng: 28.2346, address: '41 Jan Shoba St, Hatfield, Pretoria' },
  { area: 'Brooklyn', lat: -25.7530, lng: 28.2202, address: '47 Brooklyn Rd, Brooklyn, Pretoria' },
  { area: 'Menlyn', lat: -25.7754, lng: 28.2524, address: 'Menlyn Park Shopping Centre, Pretoria' },
  { area: 'Arcadia', lat: -25.7441, lng: 28.1934, address: '19 State Theatre Rd, Arcadia, Pretoria' },
  { area: 'Mooikloof', lat: -25.7917, lng: 28.2858, address: 'Mooikloof Ridge, Pretoria' },
  { area: 'Centurion', lat: -25.8651, lng: 28.1860, address: 'Centurion Mall, Centurion, Pretoria' },
  { area: 'Silver Lakes', lat: -25.8408, lng: 28.2604, address: 'Silver Lakes Golf Estate, Pretoria' },
  { area: 'Waterkloof', lat: -25.7699, lng: 28.2635, address: 'Waterkloof Ridge, Pretoria' },
  { area: 'Brooklyn', lat: -25.7540, lng: 28.2210, address: 'Brooklyn Mall, Pretoria' },
  { area: 'Erasmia', lat: -25.7465, lng: 28.1102, address: 'Erasmia Shopping Centre, Pretoria' },
  { area: 'Faerie Glen', lat: -25.7903, lng: 28.2865, address: 'Faerie Glen Mall, Pretoria' },
  { area: 'Garsfontein', lat: -25.7946, lng: 28.2850, address: 'Garsfontein Rd, Pretoria East' },
  { area: 'Mamelodi', lat: -25.7925, lng: 28.2512, address: 'Mamelodi Mall, Pretoria' },
  { area: 'Sunnyside', lat: -25.7516, lng: 28.2036, address: 'Church St, Sunnyside, Pretoria' },
  { area: 'Erasmusrand', lat: -25.8087, lng: 28.2232, address: 'Erasmusrand, Pretoria' },
  { area: 'Waterkloof Glen', lat: -25.7682, lng: 28.2460, address: '21 Corlett Dr, Pretoria' },
  { area: 'Rietfontein', lat: -25.7473, lng: 28.3158, address: 'Rietfontein Rd, Pretoria East' },
  { area: 'Pretoria CBD', lat: -25.7440, lng: 28.1880, address: 'Church Sq, Pretoria CBD' },
  { area: 'Hatfield', lat: -25.7474, lng: 28.2346, address: 'Hatfield Plaza, Pretoria' },
  { area: 'Lynnwood', lat: -25.7809, lng: 28.2685, address: 'Lynnwood Bridge, Pretoria' },
];

const PRODUCTS = [
  'Electronics Kit', 'Laptop Docking Station', 'Mobile Charger', 'Wireless Mouse',
  'Bluetooth Speaker', 'External SSD', 'Smartwatch', 'Tablet Case',
  'Power Bank', 'Gaming Keyboard', 'Network Router', 'USB-C Hub',
  'Monitor Stand', 'Surge Protector', 'Wearable Tracker',
];

const CUSTOMER_NAMES = [
  'Thandi M.', 'Sipho K.', 'Nandi Z.', 'Lerato P.',
  'Kgosi V.', 'Mandisa L.', 'Lebohang N.', 'Siyabonga D.',
  'Nosipho T.', 'Mpho R.', 'Zanele M.', 'Kopano S.',
  'Busisiwe Q.', 'Tshepo M.', 'Katlego J.', 'Palesa B.',
  'Retha K.', 'Mandy K.', 'Noxolo H.', 'Dineo X.',
];

function generateOrderNumber(): string {
  const prefix = 'SC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone(): string {
  return `+27${Math.floor(810000000 + Math.random() * 899999999)}`;
}

async function main() {
  console.log('🌱 Seeding SwiftChain database...\n');

  // Clean existing data
  await prisma.deliveryEvent.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.order.deleteMany();
  await prisma.rider.deleteMany();
  await prisma.warehouse.deleteMany();

  // Create warehouse
  const warehouse = await prisma.warehouse.create({
    data: WAREHOUSE,
  });
  console.log(`🏭 Created warehouse: ${warehouse.name}`);

  // Create riders
  const riders = [];
  for (const r of RIDERS) {
    const rider = await prisma.rider.create({
      data: {
        name: r.name,
        phone: r.phone,
        vehicleType: r.vehicleType,
        latitude: r.lat,
        longitude: r.lng,
        rating: r.rating,
        status: Math.random() > 0.3 ? 'ONLINE' : 'OFFLINE',
        totalDeliveries: Math.floor(Math.random() * 500) + 50,
        lastPingAt: new Date(),
      },
    });
    riders.push(rider);
    console.log(`🏍️  Created rider: ${rider.name} (${rider.vehicleType})`);
  }

  // Create orders in various statuses
  const statuses: Array<{ status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED'; count: number }> = [
    { status: 'PENDING', count: 6 },
    { status: 'ASSIGNED', count: 3 },
    { status: 'IN_TRANSIT', count: 4 },
    { status: 'DELIVERED', count: 5 },
    { status: 'FAILED', count: 2 },
  ];

  let orderIndex = 0;
  for (const { status, count } of statuses) {
    for (let i = 0; i < count; i++) {
      const location = DELIVERY_LOCATIONS[orderIndex % DELIVERY_LOCATIONS.length];
      const isAssigned = status !== 'PENDING';
      const rider = isAssigned ? randomElement(riders) : null;
      const priority = randomElement(['LOW', 'NORMAL', 'NORMAL', 'HIGH', 'URGENT'] as const);
      const source = randomElement(['MANUAL', 'MANUAL', 'WHATSAPP', 'API'] as const);
      const createdAt = new Date(Date.now() - Math.random() * 86400000 * 3); // up to 3 days ago

      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerName: CUSTOMER_NAMES[orderIndex % CUSTOMER_NAMES.length],
          customerPhone: randomPhone(),
          product: randomElement(PRODUCTS),
          quantity: Math.floor(Math.random() * 3) + 1,
          weight: Math.round((Math.random() * 5 + 0.2) * 10) / 10,
          priority,
          status,
          latitude: location.lat,
          longitude: location.lng,
          address: location.address,
          notes: Math.random() > 0.5 ? 'Ring bell twice, leave at door' : null,
          source,
          warehouseId: warehouse.id,
          riderId: rider?.id || null,
          assignedAt: isAssigned ? new Date(createdAt.getTime() + 300000) : null,
          pickedUpAt: ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(status)
            ? new Date(createdAt.getTime() + 600000) : null,
          deliveredAt: status === 'DELIVERED'
            ? new Date(createdAt.getTime() + 1800000 + Math.random() * 1800000) : null,
          failedAt: status === 'FAILED' ? new Date(createdAt.getTime() + 1200000) : null,
          failureReason: status === 'FAILED'
            ? randomElement(['Customer unreachable', 'Wrong address', 'Rider vehicle breakdown'])
            : null,
          createdAt,
        },
      });

      // Create delivery record for in-progress/completed orders
      if (['IN_TRANSIT', 'DELIVERED', 'FAILED'].includes(status) && rider) {
        await prisma.delivery.create({
          data: {
            orderId: order.id,
            riderId: rider.id,
            status: status === 'DELIVERED' ? 'COMPLETED' : status === 'FAILED' ? 'FAILED' : 'IN_PROGRESS',
            distanceKm: Math.round((Math.random() * 15 + 2) * 10) / 10,
            estimatedMins: Math.floor(Math.random() * 45 + 15),
            actualMins: status === 'DELIVERED' ? Math.floor(Math.random() * 50 + 20) : null,
            completedAt: status === 'DELIVERED' ? order.deliveredAt : null,
          },
        });
      }

      // Create timeline events
      const events = [{ event: 'ORDER_CREATED', createdAt }];
      if (isAssigned) events.push({ event: 'RIDER_ASSIGNED', createdAt: new Date(createdAt.getTime() + 300000) });
      if (['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(status)) {
        events.push({ event: 'ORDER_PICKED_UP', createdAt: new Date(createdAt.getTime() + 600000) });
      }
      if (status === 'IN_TRANSIT') {
        events.push({ event: 'IN_TRANSIT', createdAt: new Date(createdAt.getTime() + 660000) });
      }
      if (status === 'DELIVERED') {
        events.push({ event: 'DELIVERED', createdAt: new Date(createdAt.getTime() + 1800000) });
      }
      if (status === 'FAILED') {
        events.push({ event: 'DELIVERY_FAILED', createdAt: new Date(createdAt.getTime() + 1200000) });
      }

      for (const evt of events) {
        await prisma.deliveryEvent.create({
          data: {
            orderId: order.id,
            riderId: rider?.id,
            event: evt.event,
            createdAt: evt.createdAt,
          },
        });
      }

      console.log(`📦 Created order: ${order.orderNumber} [${status}] → ${location.area}`);
      orderIndex++;
    }
  }

  console.log('\n✅ Seed complete!');
  console.log(`   Warehouse: 1`);
  console.log(`   Riders: ${riders.length}`);
  console.log(`   Orders: ${orderIndex}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
