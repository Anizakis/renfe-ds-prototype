const TRAIN_TYPES = [
  { name: "AVE", speed: 250, basePrice: 42 },
  { name: "AVLO", speed: 230, basePrice: 28 },
  { name: "ALVIA", speed: 210, basePrice: 36 },
  { name: "MD", speed: 160, basePrice: 22 },
  { name: "AVANT", speed: 200, basePrice: 30 },
];

const DEPART_HOURS = [6, 7, 8, 9, 11, 12, 14, 15, 17, 18, 19, 20, 21];

function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function buildDayRange(startDate, days) {
  const start = new Date(startDate);
  return Array.from({ length: days }, (_, idx) => {
    const date = new Date(start);
    date.setDate(date.getDate() + idx);
    return dateKey(date);
  });
}

export function generateJourneys({ startDate, days, origin, destination }) {
  const dayKeys = buildDayRange(startDate, days);
  const journeys = [];
  dayKeys.forEach((day, dayIndex) => {
    const seedBase = Number(day.replace(/-/g, "")) + dayIndex * 97;
    const rand = mulberry32(seedBase);
    const totalPerDay = 8 + Math.floor(rand() * 9);
    for (let i = 0; i < totalPerDay; i += 1) {
      const type = TRAIN_TYPES[Math.floor(rand() * TRAIN_TYPES.length)];
      const departHour = DEPART_HOURS[(dayIndex + i) % DEPART_HOURS.length];
      const departMinute = Math.floor(rand() * 60 / 5) * 5;
      const direct = rand() > 0.25;
      const transfers = direct ? 0 : (rand() > 0.6 ? 2 : 1);
      const connectionMins = direct ? 0 : [10, 20, 30, 45][Math.floor(rand() * 4)];
      const durationMinutes = Math.max(
        60,
        Math.floor((220 - type.speed) / 2 + 70 + rand() * 40) + (transfers * 15)
      );
      const departTimeMinutes = departHour * 60 + departMinute;
      const arriveTimeMinutes = departTimeMinutes + durationMinutes + connectionMins;
      const basePrice = type.basePrice + durationMinutes * 0.08;
      const price = Math.round((basePrice + (rand() * 12) - 4) * 100) / 100;
      const services = {
        wifi: rand() > 0.35,
        power: rand() > 0.4,
        quiet: rand() > 0.6,
        cafe: rand() > 0.5,
      };
      const accessibility = {
        seat: rand() > 0.6,
        assistance: rand() > 0.7,
        companion: rand() > 0.75,
        adjacent: rand() > 0.65,
      };
      const petFriendly = rand() > 0.7;
      const petSizes = {
        small: petFriendly && rand() > 0.3,
        medium: petFriendly && rand() > 0.5,
        large: petFriendly && rand() > 0.8,
      };

      journeys.push({
        id: `${day}-${i}`,
        date: day,
        origin,
        destination,
        service: type.name,
        departTime: formatTime(departTimeMinutes),
        arriveTime: formatTime(arriveTimeMinutes),
        duration: formatDuration(durationMinutes),
        durationMinutes,
        price,
        direct,
        transfers,
        connectionMins,
        services,
        accessibility,
        petFriendly,
        petSizes,
      });
    }
  });

  return journeys;
}

export const journeys = generateJourneys({
  startDate: "2026-01-20",
  days: 14,
  origin: "Madrid",
  destination: "Valencia",
});

export const fares = [
  {
    id: "basic",
    nameKey: "faresCatalog.basic.name",
    descriptionKey: "faresCatalog.basic.description",
    price: 0,
    tone: "basic",
    featureKeys: [
      "faresCatalog.basic.features.0",
      "faresCatalog.basic.features.1",
      "faresCatalog.basic.features.2",
      "faresCatalog.basic.features.3",
    ],
  },
  {
    id: "choose",
    nameKey: "faresCatalog.choose.name",
    descriptionKey: "faresCatalog.choose.description",
    price: 7.8,
    tone: "choose",
    featureKeys: [
      "faresCatalog.choose.features.0",
      "faresCatalog.choose.features.1",
      "faresCatalog.choose.features.2",
      "faresCatalog.choose.features.3",
      "faresCatalog.choose.features.4",
    ],
  },
  {
    id: "choose-comfort",
    nameKey: "faresCatalog.comfort.name",
    descriptionKey: "faresCatalog.comfort.description",
    price: 10.3,
    tone: "comfort",
    featureKeys: [
      "faresCatalog.comfort.features.0",
      "faresCatalog.comfort.features.1",
      "faresCatalog.comfort.features.2",
      "faresCatalog.comfort.features.3",
      "faresCatalog.comfort.features.4",
      "faresCatalog.comfort.features.5",
    ],
  },
  {
    id: "premium",
    nameKey: "faresCatalog.premium.name",
    descriptionKey: "faresCatalog.premium.description",
    price: 27,
    tone: "premium",
    featureKeys: [
      "faresCatalog.premium.features.0",
      "faresCatalog.premium.features.1",
      "faresCatalog.premium.features.2",
      "faresCatalog.premium.features.3",
      "faresCatalog.premium.features.4",
    ],
  },
];

export const extras = [
  {
    id: "restauracion",
    nameKey: "extrasCatalog.restauracion.name",
    descriptionKey: "extrasCatalog.restauracion.description",
    price: 7.5,
    priceLabelKey: "extrasCatalog.restauracion.priceLabel",
  },
  {
    id: "pack-superflex",
    nameKey: "extrasCatalog.packSuperflex.name",
    descriptionKey: "extrasCatalog.packSuperflex.description",
    price: 10,
  },
  {
    id: "seat",
    nameKey: "extrasCatalog.seat.name",
    descriptionKey: "extrasCatalog.seat.description",
    price: 5,
  },
  {
    id: "puente-ave",
    nameKey: "extrasCatalog.puenteAve.name",
    descriptionKey: "extrasCatalog.puenteAve.description",
    price: 5,
  },
  {
    id: "reembolso-total",
    nameKey: "extrasCatalog.reembolsoTotal.name",
    descriptionKey: "extrasCatalog.reembolsoTotal.description",
    price: 5,
  },
  {
    id: "mascotas",
    nameKey: "extrasCatalog.mascotas.name",
    descriptionKey: "extrasCatalog.mascotas.description",
    price: 10,
  },
  {
    id: "bicicletas",
    nameKey: "extrasCatalog.bicicletas.name",
    descriptionKey: "extrasCatalog.bicicletas.description",
    price: 0,
    priceLabelKey: "extrasCatalog.bicicletas.priceLabel",
  },
  {
    id: "cambios-ilimitados",
    nameKey: "extrasCatalog.cambiosIlimitados.name",
    descriptionKey: "extrasCatalog.cambiosIlimitados.description",
    price: 5,
  },
];

export const dayTabs = buildDayRange("2026-01-22", 7);
