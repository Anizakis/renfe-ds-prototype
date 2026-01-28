export const normalizeStationName = (value = "") => {
  const normalized = value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\-/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized;
};

export const isValidStation = (value, stations = []) => {
  const normalizedValue = normalizeStationName(value);
  if (!normalizedValue) return false;

  return stations.some((station) => {
    const name = typeof station === "string" ? station : station?.name;
    return normalizeStationName(name) === normalizedValue;
  });
};

export const getStationSuggestions = (query, stations = [], limit = 8) => {
  const normalizedQuery = normalizeStationName(query);
  if (!normalizedQuery) return [];

  const matches = [];
  for (const station of stations) {
    const name = typeof station === "string" ? station : station?.name;
    if (!name) continue;
    if (normalizeStationName(name).includes(normalizedQuery)) {
      matches.push(name);
    }
    if (matches.length >= limit) break;
  }

  return matches;
};
