# SkyCast – Live Weather Dashboard

A responsive weather dashboard built with HTML, CSS, and vanilla JavaScript.
It uses the OpenWeatherMap Current Weather and 5 Day / 3 Hour Forecast APIs.

## Project files

- `index.html` – complete application (HTML, CSS, and JavaScript in one file)
- `README.md` – setup and run instructions

## Setup

1. Create a free account at https://openweathermap.org/api.
2. Generate an API key.
3. Open `index.html` in a code editor.
4. Find this line near the bottom of the file:

   `const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";`

5. Replace the placeholder with your API key and save the file.

## Run

You can open `index.html` directly in a modern browser. Alternatively, open
the project folder in Visual Studio Code and run `index.html` with the Live
Server extension.

## Features

- Search weather by city worldwide
- Current temperature and conditions
- Humidity, wind speed, pressure, and cloudiness
- Five-day forecast (derived from the API's 3-hour forecast readings)
- Dynamic weather icons and background themes
- Loading indicator and user-friendly error messages
- Responsive desktop and mobile layout

## Notes

- An internet connection and a valid OpenWeatherMap API key are required.
- New API keys may take a short time to activate.
- For a public production deployment, do not expose a private API key in
  client-side JavaScript. Use a backend proxy to protect it.
