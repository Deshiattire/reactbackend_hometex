const DEV_API_ORIGIN = "http://localhost:8000";

const trimTrailingSlashes = (value) => value.replace(/\/+$/, "");

const buildApiBaseUrl = () => {
    const configuredOrigin = (process.env.REACT_APP_API_URL || "").trim();

    if (configuredOrigin) {
        const normalizedOrigin = trimTrailingSlashes(configuredOrigin);
        return normalizedOrigin.endsWith("/api")
            ? normalizedOrigin
            : `${normalizedOrigin}/api`;
    }

    if (process.env.NODE_ENV === "development") {
        return `${DEV_API_ORIGIN}/api`;
    }

    // In production, default to same-origin API (supports reverse proxy setups).
    return "/api";
};

const Constants = Object.freeze({
    BASE_URL: buildApiBaseUrl(),
});

export default Constants;
