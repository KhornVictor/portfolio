// Weather for the status bar, from Open-Meteo (free, no key, CORS enabled).
// https://open-meteo.com/en/docs

export const PHNOM_PENH = {
  name: "Phnom Penh",
  latitude: 11.5564,
  longitude: 104.9282,
  timezone: "Asia/Phnom_Penh",
};

export interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number; // hPa (= mb)
  cloud: number; // %
  windKmh: number;
  code: number; // WMO weather code
  isDay: boolean;
  rainChance: number; // % (this hour)
  snowChance: number; // %
  visibilityKm: number;
}

export interface WeatherHour {
  time: Date;
  temp: number;
  code: number;
  isDay: boolean;
  windKmh: number;
}

export interface WeatherDay {
  date: Date;
  min: number;
  max: number;
  code: number;
}

export interface Weather {
  place: string;
  current: WeatherCurrent;
  hourly: WeatherHour[]; // from now onward
  daily: WeatherDay[];
  fetchedAt: number;
}

interface OpenMeteo {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    surface_pressure: number;
    cloud_cover: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    is_day: number[];
    wind_speed_10m: number[];
    precipitation_probability: number[];
    visibility: number[];
    snowfall: number[];
  };
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    weather_code: number[];
  };
}

export async function fetchWeather(loc = PHNOM_PENH): Promise<Weather> {
  const q = new URLSearchParams({
    latitude: String(loc.latitude),
    longitude: String(loc.longitude),
    timezone: loc.timezone,
    forecast_days: "3",
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "surface_pressure",
      "cloud_cover",
      "wind_speed_10m",
      "weather_code",
      "is_day",
    ].join(","),
    hourly: [
      "temperature_2m",
      "weather_code",
      "is_day",
      "wind_speed_10m",
      "precipitation_probability",
      "visibility",
      "snowfall",
    ].join(","),
    daily: ["temperature_2m_min", "temperature_2m_max", "weather_code"].join(","),
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${q}`);
  if (!res.ok) throw new Error(`Weather unavailable (${res.status})`);
  const d = (await res.json()) as OpenMeteo;

  // Open-Meteo returns local wall-clock times without an offset; parse them as
  // such so "16:00" shows as 16:00 regardless of the viewer's timezone.
  const parse = (s: string) => new Date(s);
  const nowIdx = Math.max(
    0,
    d.hourly.time.findIndex((t) => parse(t).getTime() >= parse(d.current.time).getTime()),
  );

  const hourly: WeatherHour[] = d.hourly.time.slice(nowIdx).map((t, k) => {
    const i = nowIdx + k;
    return {
      time: parse(t),
      temp: d.hourly.temperature_2m[i],
      code: d.hourly.weather_code[i],
      isDay: d.hourly.is_day[i] === 1,
      windKmh: d.hourly.wind_speed_10m[i],
    };
  });

  const c = d.current;
  const current: WeatherCurrent = {
    temp: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    pressure: c.surface_pressure,
    cloud: c.cloud_cover,
    windKmh: c.wind_speed_10m,
    code: c.weather_code,
    isDay: c.is_day === 1,
    rainChance: d.hourly.precipitation_probability[nowIdx] ?? 0,
    snowChance: (d.hourly.snowfall[nowIdx] ?? 0) > 0 ? 100 : 0,
    visibilityKm: (d.hourly.visibility[nowIdx] ?? 0) / 1000,
  };

  const daily: WeatherDay[] = d.daily.time.map((t, i) => ({
    date: parse(t),
    min: d.daily.temperature_2m_min[i],
    max: d.daily.temperature_2m_max[i],
    code: d.daily.weather_code[i],
  }));

  return { place: loc.name, current, hourly, daily, fetchedAt: Date.now() };
}

/** Human label for a WMO weather code. */
export function describe(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

/** Font Awesome class for a WMO weather code (day / night aware). */
export function iconFor(code: number, isDay = true): string {
  if (code === 0) return isDay ? "fa-solid fa-sun" : "fa-solid fa-moon";
  if (code <= 2) return isDay ? "fa-solid fa-cloud-sun" : "fa-solid fa-cloud-moon";
  if (code === 3) return "fa-solid fa-cloud";
  if (code <= 48) return "fa-solid fa-smog";
  if (code <= 57) return isDay ? "fa-solid fa-cloud-sun-rain" : "fa-solid fa-cloud-moon-rain";
  if (code <= 67) return "fa-solid fa-cloud-rain";
  if (code <= 77) return "fa-solid fa-snowflake";
  if (code <= 82) return "fa-solid fa-cloud-showers-heavy";
  if (code <= 86) return "fa-solid fa-snowflake";
  return "fa-solid fa-cloud-bolt";
}
