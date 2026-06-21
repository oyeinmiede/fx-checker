import { state } from "./state.js"

export function renderExchangeRate() {
    const exchangeRateEl = document.querySelector(".exchange-rate")
    exchangeRateEl.textContent = `1 ${state.fromCurrency.code} = ${state.exchangeRate.toFixed(4)} ${state.toCurrency.code}`
}

export function renderAmounts() {
    const receiveAmount = document.querySelector(".receive-amount");
    receiveAmount.textContent = state.convertedAmount.toFixed(2).toLocaleString()
}

export function renderCurrencyButtons() {
    const currencyButtons = document.querySelectorAll(".currency-btn");
    currencyButtons[0].innerHTML = `    
        <img 
            class="flag"
            src="./assets/images/flags/${state.fromCurrency.flag.toLowerCase()}.webp"
            alt=""
        >
        ${state.fromCurrency.code}
        <img 
            src="./assets/images/icon-chevron-down.svg"
            alt=""
            class="icon"
        >
    `
    currencyButtons[1].innerHTML = `
        <img 
            class="flag"
            src="./assets/images/flags/${state.toCurrency.flag.toLowerCase()}.webp"
            alt=""
        >
        ${state.toCurrency.code}
        <img 
            src="./assets/images/icon-chevron-down.svg"
            alt=""
            class="icon"
        >
    `
}

export function renderCurrencyList() {
    const list = document.querySelector(".currency-list");
    const filtered = state.currencies.filter(currency => {
        return (
            currency.code.toLowerCase().includes(state.searchQuery.toLowerCase()) || currency.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
    })

    list.innerHTML = filtered.map(currency => {
        return `
            <button 
                class="currency-option"
                data-code="${currency.code}"
            >
                <img 
                    src="./assets/images/flags/${currency.flag}.webp"
                    class="flag"
                >
                <div>
                    <strong>${currency.code}</strong>
                    <span>${currency.name}</span>
                </div>
            </button>
        `
    }).join("")
}

export function renderFavoriteButton() {
    const button = document.querySelector(".favorite")
    const pair = `${state.fromCurrency.code}-${state.toCurrency.code}`
    const isFavorite = state.favorites.includes(pair)
    if (isFavorite) {
        button.innerHTML = `
            <img src="./assets/images/icon-star-filled.svg" alt="" />
            Favorited
        `
        button.classList.add("favorited")
    } else {
        button.innerHTML = `
            <img src="./assets/images/icon-star.svg" alt="" />
            Favorite
        `
        button.classList.remove("favorited")
    }
}

export function renderFavorites() {
    const panel = document.querySelector(".favorites-container")
    if (!state.favorites.length) {
        panel.innerHTML = `
            <div class="empty-state">
                <h3>No pinned pairs yet</h3>
                <p>Pin a pair to track its rate here.</p>
            </div>
        `
        return
    }
    panel.innerHTML = state.favorites
        .filter(pair => typeof pair === "string" && pair.includes("-"))
        .map(pair => {
            const [from, to] = pair.split("-");
            return `
                <article class="favorite-row" data-pair="${pair}">
                <div>
                    <strong>${from} <span class="arrow">→</span> ${to}</strong>
                </div>
                <div class="left">
                    <div class="rate-info">
                    <h3>${state.exchangeRate}</h3>
                    <span>▲ +1.29%</span>
                    </div>
                    <button class="remove-favorite">
                    <img src="./assets/images/icon-star-filled.svg" />
                    </button>
                </div>
                </article>
            `;
        })
        .join("");

}

export function renderFavoriteCount() {
    const count = document.querySelector(".favorite-count");
    const count1 = document.querySelector(".fav-count");

    count.textContent = state.favorites.length
    count1.textContent = state.favorites.length
}

function getRelativeTime(timestamp) {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const date = new Date(timestamp);
    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "short"
        }
    );
}

export function renderLog() {
    const panel = document.querySelector(".log-container")
    if (!state.conversionLog.length) {
        panel.innerHTML = `
            <div class="empty-state">
                <h3>No conversions logged yet</h3>
                <p>Every conversion is recorded here automatically when you tap Log Conversion.</p>
            </div>
        `
        return
    }
    panel.innerHTML = state.conversionLog.map(log => {
        return `
            <div
                class="log-row"
                data-id="${log.id}"
            >
                <span class="log-time">${getRelativeTime(log.timestamp)}</span>
                <span class="log-pair">${log.fromCurrency}<span>→</span>${log.toCurrency}</span>
                <span class="log-send">${Number(log.sendAmount).toFixed(2).toLocaleString()}</span>
                <span class="log-receive">${Number(log.receiveAmount).toFixed(2).toLocaleString()}</span>
                <button class="delete-log">
                    <img src="./assets/images/icon-delete.svg" />
                </button>

            </div>
        `
    }).join("")
}

export function renderLoggedCount() {
    const count = document.querySelector(".log-count")
    const count1 = document.querySelector(".logged-count")

    count.textContent = state.conversionLog.length
    count1.textContent = state.conversionLog.length
}

export function renderHistoryStats(values) {
    if (!values.length) return

    const open = values[0]
    const last = values[values.length - 1]
    const change = last - open
    const percentChange = (change/open) * 100

    document.querySelector(".open-value").textContent = open.toFixed(4)
    document.querySelector(".last-value").textContent = last.toFixed(4)

    const changeEl = document.querySelector(".change-value")
    changeEl.textContent = `${change > 0 ? "+" : ""}${change.toFixed(4)}`
    changeEl.className = `change-value ${change >= 0 ? "positive" : "negative"}`

    const percentEl = document.querySelector(".percent-change-value")
    percentEl.textContent = `${percentChange >= 0 ? "▲" : "▼"} ${percentChange > 0 ? "+" : "-"}${Math.abs(percentChange).toFixed(2)}%`
    percentEl.className = `percent-change-value ${percentChange >= 0 ? "positive" : "negative"}`
}

export function renderChartMeta() {
    document.querySelector(".chart-pair").textContent = `${state.fromCurrency.code}/${state.toCurrency.code}`
    const now = Date.now()
    const formatted = new Intl.DateTimeFormat("en-GB", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Lagos",
        timeZoneName: "short"
    }).format(now);
    document.querySelector(".chart-rate").textContent = `${state.exchangeRate.toFixed(4)} · ${formatted}`
}