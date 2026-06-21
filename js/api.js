const BASE_URL = "https://api.frankfurter.dev/v1";

export async function getCurrencies() {
    try {
        const response = await fetch(`${BASE_URL}/currencies`)
        if (!response.ok) {
            throw new Error("Failed to fetch currencies")
        }
        const data = await response.json()
        return Object.entries(data).map(([code, name]) => ({
            code,
            name,
            flag: getFlag(code)
        }))
    } catch (error) {
        console.error(error)
        return []
    }
}

function getFlag(code) {
    if (code.length !== 3) {
        return "default"
    }
    return code.slice(0, 2).toLowerCase()
}

export async function getExchangeRate(from, to) {
    try {
        const res = await fetch(`${BASE_URL}/latest?base=${from}&symbols=${to}`)
        if (!res.ok) {
            throw new Error("Failed to fetch exchange rate")
        }
        const data = await res.json()
        return data.rates[to]
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getHistoricalRates(from, to, startDate, endDate) {
    try {
        const res = await fetch(
            `${BASE_URL}/${startDate}..${endDate}?base=${from}&symbols=${to}`
        );
        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
        const data = await res.json();
        return data.rates;
    } catch (error) {
        console.error(error);
        return null;
    }
}
