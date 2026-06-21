const FAVORITE_KEY = "fx-favorites"
const LOG_KEY = "fx-log"

export function saveFavorites(favorites) {
    localStorage.setItem(
        FAVORITE_KEY,
        JSON.stringify(favorites)
    )
}

export function saveLog(log) {
    localStorage.setItem(
        LOG_KEY,
        JSON.stringify(log)
    )
}

export function loadFavorites() {
    const data = localStorage.getItem(FAVORITE_KEY)
    return data ? JSON.parse(data) : []
}

export function loadLog() {
    const data = localStorage.getItem(LOG_KEY)
    return data ? JSON.parse(data) : []
}