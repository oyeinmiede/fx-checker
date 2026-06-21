import {
    renderAmounts,
    renderExchangeRate,
    renderCurrencyButtons,
    renderCurrencyList,
    renderFavoriteButton,
    renderFavorites,
    renderFavoriteCount,
    renderLog,
    renderLoggedCount,
    renderHistoryStats,
    renderChartMeta
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
    getHistoricalRates 
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
        document.querySelector(".currency-picker").classList.remove("hidden")
        renderCurrencyList()
    })
})

const searchInput = document.querySelector(".currency-search");
searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value
    renderCurrencyList()
})

const currencyList = document.querySelector(".currency-list");
currencyList.addEventListener("click", (e) => {
    const button = e.target.closest(".currency-option")
    if (!button) return
    const selected = state.currencies.find(currency => currency.code === button.dataset.code)
    if (state.pickerTarget === "from") {
        state.fromCurrency = selected
        convertCurrency()
    } else {
        state.toCurrency = selected
        convertCurrency()
    }
    document.querySelector(".currency-picker").classList.add("hidden")

    renderCurrencyButtons()
    renderExchangeRate()
})

async function initializeApp() {
    const currencies = await getCurrencies()
    state.currencies = currencies
    state.favorites = loadFavorites()
    state.conversionLog = loadLog()
    await convertCurrency()
    await loadHistory()
    renderChartMeta()
    renderCurrencyList()
    renderFavoriteButton();
    renderFavoriteButton()
    renderFavorites()
    renderFavoriteCount()
    renderLog()
    renderLoggedCount()
}

async function convertCurrency() {
    const rate = await getExchangeRate(state.fromCurrency.code, state.toCurrency.code)
    if (!rate) return
    updateConversion(rate)
    renderAmounts()
    renderExchangeRate()
    renderFavoriteButton();
    renderFavorites()
    renderFavoriteCount()
    renderLog()
    renderLoggedCount()
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
logButton.addEventListener("click", () => {
    addConversionLog()
    saveLog(state.conversionLog)
    renderLog()
    renderLoggedCount()
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
    const labels = Object.keys(rates)
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

initializeApp()