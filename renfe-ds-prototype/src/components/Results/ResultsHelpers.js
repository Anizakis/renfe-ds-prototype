// Helpers específicos para lógica de Results
export function addDays(dateKey, amount) {
  const date = new Date(dateKey);
  date.setDate(date.getDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function getMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return (h * 60) + m;
}

export function buildInitialFilters(search, createDefaultFilters) {
  const base = createDefaultFilters();
  return {
    ...base,
    directOnly: Boolean(search?.directOnly),
    petFriendly: Boolean(search?.petOption),
    accessibilitySeat: Boolean(search?.accessibilitySeat),
    accessibilityAssistance: Boolean(search?.accessibilityAssistance),
  };
}

export function applyFilters(journeyList, filters) {
  const maxDurationMap = {
    "2": 120,
    "3": 180,
    "4": 240,
  };
  const maxDuration = maxDurationMap[filters.maxDuration] ?? 240;
  const selectedPetTypes = Object.entries(filters.petTypes || {})
    .filter(([, value]) => value)
    .map(([key]) => key);
  const selectedPetSizes = Object.entries(filters.petSizes || {})
    .filter(([, value]) => value)
    .map(([key]) => key);
  const timeBands = {
    morning: { start: 6, end: 12 },
    afternoon: { start: 12, end: 18 },
    night: { start: 18, end: 24 },
  };
  const activeBands = Object.entries(filters.timePresets || {})
    .filter(([, value]) => value)
    .map(([key]) => timeBands[key]);
  const selectedTrains = [
    filters.trainAve && "AVE",
    filters.trainAvlo && "AVLO",
    filters.trainAlvia && "ALVIA",
    filters.trainMd && "MD",
  ].filter(Boolean);

  return journeyList.filter((journey) => {
    if (filters.directOnly && !journey.direct) return false;
    if (!filters.directOnly) {
      const maxTransfers = Number(filters.maxTransfers);
      if (journey.transfers > maxTransfers) return false;
      if (journey.transfers > 0 && Number(filters.minConnection) > journey.connectionMins) return false;
    }
    if (journey.price > filters.maxPrice) return false;
    if (journey.durationMinutes > maxDuration) return false;
    const departMinutes = getMinutes(journey.departTime);
    const arriveMinutes = getMinutes(journey.arriveTime);
    if (departMinutes < filters.departStart * 60 || departMinutes > filters.departEnd * 60) return false;
    if (arriveMinutes < filters.arriveStart * 60 || arriveMinutes > filters.arriveEnd * 60) return false;
    if (activeBands.length > 0) {
      const inBand = activeBands.some((band) =>
        departMinutes >= band.start * 60 && departMinutes < band.end * 60
      );
      if (!inBand) return false;
    }
    if (filters.petFriendly && !journey.petFriendly) return false;
    if (selectedPetTypes.length > 0 && !journey.petFriendly) return false;
    if (selectedPetSizes.length > 0 && !journey.petFriendly) return false;
    if (filters.accessibilitySeat && !journey.accessibility.seat) return false;
    if (filters.accessibilityAssistance && !journey.accessibility.assistance) return false;
    if (selectedTrains.length > 0 && !selectedTrains.includes(journey.service)) return false;
    return true;
  });
}
