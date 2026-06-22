import {
    renderAmounts,
    renderExchangeRate,
    renderCurrencyButtons,
    renderFavoriteButton,
    renderFavorites,
    renderFavoriteCount,
    renderLog,
    renderLoggedCount,
    renderHistoryStats,
    renderChartMeta,
    renderCompare,
    renderTicker,
    renderCurrencyCount,
    renderFilteredCurrencies,
    renderCurrencyPicker
} from "./ui.js";
import {
    state,
    swapCurrencies,
    updateConversion,
    toggleFavorites,
    addConversionLog
} from "./state.js";
import {
    getCurrencies,
    getExchangeRate,
    getHistoricalRates,
    getMultipleRates,
    getTickerRates,
    hideError,
    showError
} from "./api.js";
import {
    loadFavorites,
    saveFavorites,
    saveLog,
    loadLog
} from './storage.js'
import { renderChart } from "./chart.js";

const amountInput = document.querySelector(".amount-input")
amountInput.addEventListener("input", (e) => {
    state.amount = Number(e.target.value)
    convertCurrency()

    renderAmounts()
})

const swapButton = document.querySelector(".swap-btn");
swapButton.addEventListener("click", async () => {
    swapCurrencies()
    renderCurrencyButtons()
    await convertCurrency()
    renderFavoriteButton();
})

const currencyButtons = document.querySelectorAll(".currency-btn");
currencyButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        state.pickerTarget = index === 0 ? "from" : "to"
        const picker = document.querySelector(".currency-picker")
        const rect = button.getBoundingClientRect()

        picker.classList.toggle("hidden")

        picker.style.top = `${window.scrollY + rect.bottom + 10}px`;
        if (state.pickerTarget === "from") {
            picker.style.left = `${window.scrollX + rect.left}px`;
        } else {
            picker.style.left = `${window.scrollX + rect.right - picker.offsetWidth}px`;
        }
        renderCurrencyPicker()
    })
})

const searchInput = document.querySelector(".currency-search");
searchInput.addEventListener("input", (e) => {
    renderFilteredCurrencies(e.target.value)
})

const currencyList = document.querySelector(".currency-list");
document.addEventListener("click", async (e) => {
    const button = e.target.closest(".currency-option")
    if (!button) return
    const selected = state.currencies.find(currency => currency.code === button.dataset.code)
    if (state.pickerTarget === "from") {
        state.fromCurrency = selected
    } else {
        state.toCurrency = selected
    }
    await convertCurrency()
    renderCurrencyButtons()

    document.querySelector(".currency-picker").classList.add("hidden")
})

document.addEventListener("click", (e) => {
    const picker = document.querySelector(".currency-picker");
    const clickedInsidePicker = e.target.closest(".currency-picker");
    const clickedCurrencyButton = e.target.closest(".currency-btn");
    if (
        !clickedInsidePicker &&
        !clickedCurrencyButton
    ) {
        picker.classList.add("hidden");
    }
});

async function initializeApp() {
    const currencies = await getCurrencies()
    state.currencies = currencies
    state.favorites = loadFavorites()
    state.conversionLog = loadLog()
    await convertCurrency()
    await loadHistory()
    await loadCompareData()
    await loadTicker()
    renderChartMeta()
    renderCurrencyPicker()
    renderFavoriteButton();
    renderFavoriteButton()
    renderFavorites()
    renderFavoriteCount()
    renderLog()
    renderLoggedCount()
    renderCurrencyCount()
    renderCompare()
}

async function convertCurrency() {
    hideError()
    const rate = await getExchangeRate(state.fromCurrency.code, state.toCurrency.code)
    if (!rate) {
        showError(
            `${state.fromCurrency.code}/${state.toCurrency.code} is not supported by the exchange rate provider.`
        );
        document.querySelector(".receive-amount").textContent = "--";
        document.querySelector(".exchange-rate").textContent = "Unavailable";

        document.querySelector(".history-panel").classList.add("disabled");
        return;
    }
    updateConversion(rate)
    renderAmounts()
    renderExchangeRate()
    renderFavoriteButton();
    renderFavorites()
    renderFavoriteCount()
    renderLog()
    renderLoggedCount()
    await loadCompareData()
}

const favoriteButton = document.querySelector(".favorite");
favoriteButton.addEventListener("click", () => {
    toggleFavorites()
    saveFavorites(state.favorites)
    renderFavoriteButton()
    renderFavorites()
    renderFavoriteCount()
})

const favoritesPanel = document.querySelector(".favorites-container");
favoritesPanel.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-favorite")
    if (!btn) return
    const row = e.target.closest(".favorite-row");
    const pair = row.dataset.pair
    state.favorites = state.favorites.filter(item => item !== pair)
    saveFavorites(state.favorites)
    renderFavorites()
    renderFavoriteButton()
    renderFavoriteCount()
})

const logButton = document.querySelector(".log")
let logTimeout
logButton.addEventListener("click", () => {
    addConversionLog()
    saveLog(state.conversionLog)
    renderLog()
    renderLoggedCount()

    clearTimeout(logTimeout)
    logButton.innerHTML = `<img src="./assets/images/icon-check.svg" /> Logged`
    logButton.classList.add("favorited")
    logTimeout = setTimeout(() => {
        logButton.textContent = "Log Conversion"
        logButton.classList.remove("favorited")
    }, 3000)
})

const logContainer = document.querySelector(".log-container")
logContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-log")) return
    const row = e.target.closest(".log-row")
    const id = Number(row.dataset.id)
    state.conversionLog = state.conversionLog.filter(item => item.id !== id)
    saveLog(state.conversionLog)
    renderLog()
    renderLoggedCount()
})

const clearAllButton = document.querySelector(".log-panel .panel-header button");
clearAllButton.addEventListener("click", () => {
    state.conversionLog = []
    saveLog([])
    renderLog()
    renderLoggedCount()
})

function getStartDate(range) {
    const date = new Date()
    switch (range) {
        case "1d": date.setDate(date.getDate() - 1)
            break
        case "1w": date.setDate(date.getDate() - 7)
            break
        case "1m": date.setMonth(date.getMonth() - 1)
            break
        case "3m": date.setMonth(date.getMonth() - 3)
            break
        case "1y": date.setFullYear(date.getFullYear() - 1)
            break
        case "5y": date.setFullYear(date.getFullYear() - 5)
            break
    }
    return date.toISOString().split("T")[0]
}

function getEndDate() {
    const date = new Date();
    return date.toISOString().split("T")[0];
}

function formatChartDate(date) {
    const parsed = new Date(date);
    const now = new Date();
    const diffYears = now.getFullYear() - parsed.getFullYear();
    const options = {
        month: "short",
        day: "numeric",
        ...(diffYears > 0 ? { year: "numeric" } : {})
    };

    return parsed.toLocaleDateString("en-US", options);
}


async function loadHistory() {
    const startDate = getStartDate(state.activeRange)
    const endDate = getEndDate()
    const rates = await getHistoricalRates(
        state.fromCurrency.code,
        state.toCurrency.code,
        startDate,
        endDate
    )
    if (!rates) return
    const labels = Object.keys(rates).map(formatChartDate)
    const values = Object.values(rates).map(rate => rate[state.toCurrency.code])
    renderChart(labels, values)
    renderHistoryStats(values)
}

const rangeButtons = document.querySelectorAll(".range-selector button")
rangeButtons.forEach(button => {
    button.addEventListener("click", async () => {
        rangeButtons.forEach(btn => btn.classList.remove("active"))
        button.classList.add("active")
        state.activeRange = button.textContent.toLowerCase()
        await loadHistory()
    })
})

async function loadCompareData() {
    const rates = await getMultipleRates(state.fromCurrency.code, state.compareCurrencies)
    if (!rates) return
    state.compareData = Object.entries(rates)
    renderCompare()
}

function generateChange() {
    return (
        (Math.random() * 2) - 1
    ).toFixed(2);
}

async function loadTicker() {
    const rates = await getTickerRates()
    state.tickerData = rates.map(item => ({
        ...item,
        change: generateChange()
    }))
    renderTicker()
}

const tabs = document.querySelectorAll(".tab")
const panels = document.querySelectorAll(".tab-panel")

tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => {
            t.classList.remove("active")
        })
        panels.forEach(p => {
            p.classList.add('hidden')
        })
        tab.classList.add("active")
        panels[index].classList.remove("hidden")
    })
})

initializeApp()
setInterval(loadTicker, 60000)