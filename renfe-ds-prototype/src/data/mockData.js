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
    name: "Básico",
    description: "Cambio con coste, sin reembolso.",
    price: 0,
    tone: "basic",
    features: [
      "Permite 1 cambio hasta 24 horas antes (10 € + diferencia de precio)",
      "Cambio de titular con coste",
      "No reembolsable",
      "Equipaje: hasta 3 bultos (máx. 25kg)",
    ],
  },
  {
    id: "choose",
    name: "Elige",
    description: "Un cambio gratuito, reembolso parcial.",
    price: 7.8,
    tone: "choose",
    features: [
      "Un cambio gratuito, siguientes 10 €",
      "Cambio de titular con coste",
      "Cambio por pérdida de tren con coste",
      "Reembolsable 70%",
      "Equipaje: hasta 3 bultos (máx. 25kg)",
    ],
  },
  {
    id: "choose-comfort",
    name: "Elige Confort",
    description: "Asiento extragrande, reembolso parcial.",
    price: 10.3,
    tone: "comfort",
    features: [
      "Asiento Extragrande",
      "Un cambio gratuito, siguientes 10 €",
      "Reembolsable 70%",
      "Cambio de titular con coste",
      "Cambio por pérdida de tren con coste",
      "Equipaje: hasta 3 bultos (máx. 25kg)",
    ],
  },
  {
    id: "premium",
    name: "Prémium",
    description: "Cambios y reembolso total.",
    price: 27,
    tone: "premium",
    features: [
      "Asiento extragrande Confort",
      "Cambios gratuitos ilimitados, Puente AVE, Cambio por pérdida de tren, Cambio de titular gratuito",
      "100% reembolsable hasta 7 días, después 95%",
      "Selección de asiento, Acceso a salas club y restauración a la plaza",
      "Equipaje: hasta 3 bultos (máx. 25kg)",
    ],
  },
];

export const extras = [
  {
    id: "restauracion",
    name: "Restauración",
    description: "Selecciona tu menú ahora o hasta 12 horas antes de la salida",
    price: 7.5,
    priceLabel: "Desde 7,50 €",
  },
  {
    id: "pack-superflex",
    name: "Pack Superflex",
    description: "Cambios gratuitos ilimitados + Puente AVE + Reembolso total",
    price: 10,
  },
  {
    id: "seat",
    name: "Selección de asiento",
    description: "Selecciona la plaza que deseas",
    price: 5,
  },
  {
    id: "puente-ave",
    name: "Puente AVE",
    description: "Cambia tu salida el mismo día del viaje sin coste extra",
    price: 5,
  },
  {
    id: "reembolso-total",
    name: "Reembolso Total",
    description: "En caso de anulación, recupera el 100% del importe del billete",
    price: 5,
  },
  {
    id: "mascotas",
    name: "Mascotas",
    description: "Animales hasta 10kg en transportín (máx. 60x35x35 cm) permitidos",
    price: 10,
  },
  {
    id: "bicicletas",
    name: "Bicicletas",
    description: "Solo bicicletas plegadas/embaladas (máx. 140x90x40 cm) permitidas.",
    price: 0,
    priceLabel: "GRATIS",
  },
  {
    id: "cambios-ilimitados",
    name: "Cambios Gratuitos Ilimitados",
    description:  "Cambia fecha y hora sin límite, pagando solo diferencia de precio",
    price: 5,
  },
];

export const dayTabs = buildDayRange("2026-01-22", 7);
