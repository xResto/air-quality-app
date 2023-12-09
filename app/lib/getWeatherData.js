export const getWeatherData = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
      {
        cache: 'no-store',
      }
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return null;
  }
};
