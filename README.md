# Frontend Mentor - FX Checker Solution

![Design preview for the FX Checker coding challenge](./preview.jpg)

This is my solution to the FX Checker challenge on Frontend Mentor. The goal was to build a responsive foreign exchange dashboard that allows users to convert currencies using live exchange rates, explore historical data, compare currencies, save favorites, and maintain a conversion log.

## Overview

### The Challenge

Users should be able to:

* Convert currencies using live exchange rates
* Search and select currencies from a full currency list
* Swap send and receive currencies
* View historical exchange-rate performance
* Compare a currency against multiple other currencies
* Save favorite currency pairs
* Store conversion history locally
* View a live markets ticker
* Use the application across different screen sizes

### Screenshot

*Add your project screenshot here.*

### Links

* Live Site URL: [Live](https://fx-checker-tau.vercel.app/)
* Repository URL: [Repo](https://github.com/oyeinmiede/fx-checker)

## Built With

* Semantic HTML5
* Modern CSS
* Vanilla JavaScript (ES Modules)
* Frankfurter API
* Chart.js
* LocalStorage

## Features

### Currency Conversion

* Real-time currency conversion
* Dynamic exchange-rate display
* Currency swapping functionality

### Currency Picker

* Search currencies by code or name
* Popular currencies section
* Complete currency directory
* Dynamic currency selection

### Historical Data

* Historical exchange-rate tracking
* Multiple date ranges:

  * 1 Day
  * 1 Week
  * 1 Month
  * 3 Months
  * 1 Year
  * 5 Years
* Interactive Chart.js visualizations
* Change and percentage change calculations

### Multi-Currency Comparison

* Compare a base currency against multiple currencies
* Live conversion values
* Exchange-rate reference values

### Favorites

* Save favorite currency pairs
* Persistent storage using LocalStorage
* Quick access to frequently used pairs

### Conversion Log

* Record conversions
* Persistent browser storage
* Individual deletion
* Clear-all functionality
* Visual feedback when a conversion is logged

### Live Markets Ticker

* Live exchange-rate display
* Simulated market movement indicators
* Automatic updates

## What I Learned

This project pushed me beyond simple CRUD-style applications and introduced several concepts commonly found in real-world financial dashboards.

Some of the things I practiced include:

* Working with external APIs
* Managing application state without a framework
* Structuring a larger JavaScript project using modules
* Building reusable rendering functions
* Working with Chart.js
* Using LocalStorage for persistence
* Handling asynchronous data fetching
* Creating dynamic UI updates based on state changes
* Implementing search and filtering functionality

## Continued Development

Some features I would like to improve in future iterations:

* Improved accessibility support
* Better keyboard navigation
* CSV export for conversion logs
* URL-based currency sharing
* Offline caching for exchange rates
* More advanced market statistics
* Better loading and error states
* Theme switching

## Project Structure

```text
foreign-exchange-checker
│
├── index.html
│
├── css
│   ├── style.css
│   └── responsive.css
│
├── js
│   ├── app.js
│   ├── api.js
│   ├── chart.js
│   ├── state.js
│   ├── storage.js
│   └── ui.js
│
├── assets
│   ├── fonts
│   └── images
│
└── README.md
```

## Useful Resources

* Frontend Mentor
* Frankfurter API
* Chart.js Documentation
* MDN Web Docs

## Author

* Frontend Mentor - [Frontend Mentor Profile](https://www.frontendmentor.io/profile/oyeinmiede)
* GitHub - [Github Profile](https://github.com/oyeinmiede)

## Acknowledgments

Thanks to the Frontend Mentor community for feedback and inspiration throughout the challenge.
