export const state = {
    amount: 1000,
    fromCurrency: {
        code: "USD",
        flag: "us",
        name: "US Dollar"
    },
    toCurrency: {
        code: "EUR",
        flag: "eu",
        name: "Euro"
    },
    convertedAmount: null,
    exchangeRate: null,
    activeTab: "history",
    activeRange: "1m",
    favorites: [],
    conversionLog: [],
    currencies: [],
    historicalData: [],
    compareCurrencies: [
        "EUR",
        "GBP",
        "CAD",
        "JPY",
        "NGN",
        "AUD",
        "CHF",
        "CNY"
    ],
    compareData: [],
    pickerOpen: false,
    pickerTarget: null,
    searchQuery: "",
    tickerData: [],
    popularCurrencies: [
        "USD",
        "EUR",
        "GBP"
    ],
}

export function swapCurrencies() {
    const oldFrom = state.fromCurrency
    state.fromCurrency = state.toCurrency
    state.toCurrency = oldFrom
}

export function updateConversion(rate) {
    state.exchangeRate = rate
    state.convertedAmount = state.amount * rate
}

export function getPairKey() {
    return `${state.fromCurrency.code}-${state.toCurrency.code}`
}

export function toggleFavorites() {
    const pair = getPairKey()
    const exists = state.favorites.includes(pair)
    if (exists) {
        state.favorites = state.favorites.filter(item => item !== pair)
    } else {
        state.favorites.push(pair)
    }
}

export function addConversionLog() {
    state.conversionLog.unshift({
        id: Date.now(),
        timestamp: Date.now(),
        fromCurrency: state.fromCurrency.code,
        toCurrency: state.toCurrency.code,
        sendAmount: state.amount,
        receiveAmount: state.convertedAmount
    })
}