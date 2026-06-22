import { state } from "./state.js"
import { saveFavorites } from "./storage.js";

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

function currencyRow(currency) {
    const selectCode = state.pickerTarget === "from"
        ? state.fromCurrency.code
        : state.toCurrency.code

    return `
        <button
            class="currency-option"
            data-code="${currency.code}"
        >
            <div class="currency-info">
                <img
                    src="./assets/images/flags/${currency.flag}.webp"
                    alt="${currency.code}"
                />
                <div>
                    <strong>${currency.code}</strong>
                    <span>${currency.name}</span>
                </div>
            </div>
            <span class="selected-mark">
                ${currency.code === selectCode
            ? '<img src="./assets/images/icon-check.svg" />'
            : ""
        }
            </span>
        </button>
    `
}

export function renderCurrencyPicker() {
    const popular = state.currencies.filter(currency => state.popularCurrencies.includes(currency.code))
    const others = state.currencies.filter(currency => !state.popularCurrencies.includes(currency.code))
    document.querySelector(".popular-count").textContent = popular.length
    document.querySelector(".other-count").textContent = others.length

    document.querySelector(".popular-list").innerHTML = popular.map(currencyRow).join("")
    document.querySelector(".other-list").innerHTML = others.map(currencyRow).join("")
}

export function renderFilteredCurrencies(search) {
    const query = search.toLowerCase().trim()
    if (!query) {
        renderCurrencyPicker()
        return
    }
    const filtered = state.currencies.filter(currency =>
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query))

    document.querySelector(".popular-list").innerHTML = ""
    document.querySelector(".other-list").innerHTML = filtered.map(currencyRow).join("")

    document.querySelector(".popular-count").textContent = 0
    document.querySelector(".other-count").textContent = filtered.length
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

    const validFavorites = state.favorites.filter(pair => typeof pair === "string" && pair.includes("-"));
    count.textContent = validFavorites.length;
    count1.textContent = validFavorites.length;
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
    const percentChange = (change / open) * 100

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


export function renderCompare() {
    const panel = document.querySelector(".compare-container");
    panel.innerHTML = state.compareData.map(([code, rate]) => {
        const currency = state.currencies.find(curr => curr.code === code);
        const pair = `${state.fromCurrency.code}-${code}`;
        const isFavorite = state.favorites.includes(pair);

        return `
            <div class="compare-row" data-pair="${pair}">
            <div class="flag">
                <img src="./assets/images/flags/${currency?.flag}.webp" />
            </div>
            <div>
                <strong>${code}</strong>
                <span>${currency?.name || code}</span>
            </div>
            <div class="rate-info">
                <p>${(state.amount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                <span>@${rate.toFixed(4)}</span>
            </div>
            <button class="is-favorite ${isFavorite ? "favorited" : ""}">
                <img src="./assets/images/${isFavorite ? "icon-star-filled.svg" : "icon-star.svg"}" />
            </button>
            </div>
        `;
    }).join("");

    document.querySelector(".compare-amount").textContent = state.amount.toLocaleString();
    document.querySelector(".compare-from").textContent = state.fromCurrency.code;
    document.querySelector(".compare-count").textContent = state.compareData.length;

    attachFavoriteListeners();
}


function attachFavoriteListeners() {
    document.querySelectorAll(".is-favorite").forEach(button => {
        button.addEventListener("click", () => {
            const row = button.closest(".compare-row");
            const code = row.querySelector("strong").textContent;
            const pair = `${state.fromCurrency.code}-${code}`;

            if (state.favorites.includes(pair)) {
                state.favorites = state.favorites.filter(fav => fav !== pair);
            } else {
                state.favorites.push(pair);
            }

            saveFavorites(state.favorites)

            renderFavoriteButton();
            renderFavorites();
            renderFavoriteCount();
            renderCompare()
        });
    });
}


export function renderTicker() {
    const track = document.querySelector(".ticker-track")
    track.innerHTML = state.tickerData.map(item => {
        const positive = item.change >= 0
        return `
            <div class="ticker-item">
                <span class="currency-pair">${item.pair}</span>
                <span>${item.rate.toFixed(4)}</span>
                <span
                    class="${positive
                ? "positive"
                : "negative"
            }"
                >
                    ${positive
                ? "▲"
                : "▼"
            }
                    ${Math.abs(
                item.change
            ).toFixed(2)}%
                </span>
            </div>
        `
    }).join("")
}

export function renderCurrencyCount() {
    document.querySelector(".currency-count").textContent = state.currencies.length
}