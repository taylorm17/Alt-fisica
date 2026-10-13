
(() => {
  const GA_ID = "G-DWQPQXCW78";
  const CONSENT_KEY = "masterclass_cookie_consent";
  const CONSENT_VERSION = 1;
  const CONSENT_DAYS = 365;

  const banner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("accept-cookies");
  const rejectButton = document.getElementById("reject-cookies");
  const settingsButton = document.getElementById("cookie-settings");

  if (!banner || !acceptButton || !rejectButton || !settingsButton) {
    console.error("Elementos do banner de cookies não encontrados.");
    return;
  }

  function readConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;

      const consent = JSON.parse(raw);

      if (
        consent.version !== CONSENT_VERSION ||
        !["accepted", "rejected"].includes(consent.choice) ||
        !Number.isFinite(consent.timestamp) ||
        Date.now() - consent.timestamp > CONSENT_DAYS * 86400000
      ) {
        localStorage.removeItem(CONSENT_KEY);
        return null;
      }

      return consent.choice;
    } catch {
      return null;
    }
  }

  function saveConsent(choice) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      choice,
      version: CONSENT_VERSION,
      timestamp: Date.now()
    }));
  }

  function loadAnalytics() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", GA_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(GA_ID);

    script.onerror = () => {
      window.__gaLoaded = false;
    };

    document.head.appendChild(script);
  }

  function clearAnalyticsCookies() {
    const names = document.cookie
      .split(";")
      .map(cookie => cookie.trim().split("=")[0])
      .filter(name =>
        /^_ga(?:_|$)/.test(name) ||
        /^_gid$/.test(name) ||
        /^_gat(?:_|$)/.test(name) ||
        /^_gac_/.test(name)
      );

    const host = location.hostname;
    const rootDomain = host.split(".").slice(-2).join(".");

    for (const name of names) {
      for (const path of ["/", location.pathname]) {
        document.cookie =
          `${name}=; Max-Age=0; path=${path}; SameSite=Lax`;
        document.cookie =
          `${name}=; Max-Age=0; path=${path}; domain=${host}; SameSite=Lax`;

        if (host !== rootDomain) {
          document.cookie =
            `${name}=; Max-Age=0; path=${path}; domain=.${rootDomain}; SameSite=Lax`;
        }
      }
    }
  }

  function showBanner() {
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  function choose(choice) {
    saveConsent(choice);
    hideBanner();

    if (choice === "accepted") {
      loadAnalytics();
    } else {
      clearAnalyticsCookies();
    }
  }

  acceptButton.addEventListener("click", () => {
    choose("accepted");
  });

  rejectButton.addEventListener("click", () => {
    choose("rejected");
  });

  settingsButton.addEventListener("click", () => {
    showBanner();
  });

  const consent = readConsent();

  if (consent === "accepted") {
    loadAnalytics();
  } else if (consent === "rejected") {
    clearAnalyticsCookies();
  } else {
    showBanner();
  }
})();
