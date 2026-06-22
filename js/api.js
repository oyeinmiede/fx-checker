const V1_URL = "https://api.frankfurter.dev/v1";
const V2_URL = "https://api.frankfurter.dev/v2";

export async function getCurrencies() {
    try {
        const response = await fetch(`${V2_URL}/currencies`);

        if (!response.ok) {
            throw new Error("Failed to fetch currencies");
        }

        const data = await response.json();

        return data.map(currency => ({
            code: currency.iso_code,
            name: currency.name,
            symbol: currency.symbol,
            flag: getFlag(currency.iso_code)
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const currencyFlags = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    NGN: "ng",
    CAD: "ca",
    AUD: "au",
    JPY: "jp",
    CNY: "cn",
    INR: "in",
    KRW: "kr",
    CHF: "ch",
    SEK: "se",
    NOK: "no",
    DKK: "dk",
    PLN: "pl",
    CZK: "cz",
    HUF: "hu",
    SGD: "sg",
    HKD: "hk",
    NZD: "nz",
    AED: "ae",
    ARS: "ar",
    BD: "bd",
    BG: "bg",
    BH: "bh",
    BRL: "br",
    CLP: "cl",
    CO: "co",
    CY: "cy",
    ISK: "is",
    EGP: "eg",
    HRK: "hr",
    HTG: "ht",
    IDR: "id",
    ILS: "il",
    JO: "jo",
    KE: "ke",
    KW: "kw",
    LB: "lb",
    LC: "lc",
    LKR: "lk",
    MAD: "ma",
    MXN: "mx",
    MYR: "my",
    NP: "np",
    OM: "om",
    PEN: "pe",
    PHP: "ph",
    PKR: "pk",
    QA: "qa",
    RON: "ro",
    RUB: "ru",
    SAR: "sa",
    THB: "th",
    TRY: "tr",
    TWD: "tw",
    UAH: "ua",
    VND: "vn",
    ZAR: "za"
};


function getFlag(code) {
    return currencyFlags[code] || "default";
}

export async function getExchangeRate(from, to) {
    try {
        const response = await fetch(
            `${V1_URL}/latest?base=${from}&symbols=${to}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch exchange rate");
        }

        const data = await response.json();

        return data.rates[to];
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getHistoricalRates(
    from,
    to,
    startDate,
    endDate
) {
    try {
        const response = await fetch(
            `${V1_URL}/${startDate}..${endDate}?base=${from}&symbols=${to}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! ${response.status}`);
        }

        const data = await response.json();

        return data.rates;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getMultipleRates(from, currencies) {
    try {
        const response = await fetch(
            `${V1_URL}/latest?base=${from}&symbols=${currencies.join(",")}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch rates");
        }

        const data = await response.json();

        return data.rates;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getTickerRates() {
    const pairs = [
        ["USD", "EUR"],
        ["GBP", "USD"],
        ["USD", "JPY"],
        ["USD", "CAD"],
        ["EUR", "GBP"],
        ["CNY", "HKD"],
        ["INR", "MYR"],
        ["NZD", "GBP"],
        ["USD", "KRW"],
        ["AUD", "NZD"],
        ["EUR", "CHF"],
        ["USD", "MXN"],
        ["USD", "BRL"],
        ["USD", "ZAR"],
        ["EUR", "JPY"],
        ["GBP", "CHF"],
        ["USD", "INR"],
        ["USD", "CNY"] 
    ];

    try {
        const results = await Promise.all(
            pairs.map(async ([from, to]) => {
                const response = await fetch(
                    `${V1_URL}/latest?base=${from}&symbols=${to}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch ${from}/${to}`
                    );
                }

                const data = await response.json();

                return {
                    pair: `${from}/${to}`,
                    rate: data.rates[to]
                };
            })
        );

        return results;
    } catch (error) {
        console.error(error);
        return [];
    }
}

const errorBanner = document.querySelector(".error-banner");
const errorMessage = document.querySelector(".error-message");

export function showError(message) {
    errorMessage.textContent = message;
    errorBanner.classList.remove("hidden");
}

export function hideError() {
    errorBanner.classList.add("hidden");
}