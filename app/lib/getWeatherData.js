export const getWeatherData = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=a0114f8af989ce183891e75014403eef`,
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
