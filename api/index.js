import fetch from "node-fetch";

const API_BY = "API BY ZX OSINT @zxosint & nawab sahab dm to purchase ";
const VALID_KEYS = ["zxcracks", "ZXOSINT456", "ZX-PRIVATE-KEY"];

export default async function handler(req, res) {
  try {
    const { key, type, term } = req.query;

    // 🔐 API KEY CHECK
    if (!key || !VALID_KEYS.includes(key)) {
      return res.status(401).json({
        success: false,
        error: "Invalid API key",
        api_by: API_BY
      });
    }

    if (!type || !term) {
      return res.status(400).json({
        success: false,
        error: "Missing type or term",
        api_by: API_BY
      });
    }

    let url = "";
    let result = null;

    // 🔁 ROUTER
    switch (type.toLowerCase()) {

      case "ffbancheck":
        url = `https://ban-check-api-nwqa.vercel.app/ban-check?uid=${term}`;
        break;

      case "mailinfo":
        url = `https://ab-mailinfoapi.vercel.app/info?mail=${encodeURIComponent(term)}`;
        break;

      case "ifsc":
        url = `https://ab-ifscinfoapi.vercel.app/info?ifsc=${term}`;
        break;

      case "basicnum":
        url = `https://ab-calltraceapi.vercel.app/info?number=${term}`;
        break;

      case "pak":
        url = `https://x.taitaninfo.workers.dev/?paknumber=${term}`;
        break;

      case "imei":
        url = `https://xc.taitaninfo.workers.dev/?imei=${term}`;
        break;

      case "imagegenbasic":
        return res.json({
          success: true,
          type,
          query: term,
          image_url: `https://botmaker.serv00.net/pollination.php?prompt=${encodeURIComponent(term)}`,
          api_by: API_BY
        });

      case "advanceimg":
        return res.json({
          success: true,
          type,
          query: term,
          image_url: `https://splexx-api-img.vercel.app/api/imggen?key=SPLEXXO&text=${encodeURIComponent(term)}`,
          api_by: API_BY
        });

      case "rc": {
        const r1 = await fetch(`https://vehicle-eight-vert.vercel.app/api?rc=${term}`).then(r => r.json());
        const r2 = await fetch(`https://vehicle-n4u5priti-shubham-chaudhary-s-projects-f9650436.vercel.app/api/vehicle?vehical=${term}`).then(r => r.json());

        result = { source1: r1, source2: r2 };
        break;
      }

      default:
        return res.status(400).json({
          success: false,
          error: "Invalid lookup type",
          api_by: API_BY
        });
    }

    // 🌐 FETCH EXTERNAL API
    if (!result && url) {
      const response = await fetch(url);
      result = await response.json();
    }

    // 🧹 CLEAN UNWANTED FIELDS
    const removeKeys = [
      "owner",
      "channel",
      "credit",
      "developer_credits",
      "telegram_id",
      "telegram_channel"
    ];

    const clean = (obj) => {
      if (Array.isArray(obj)) return obj.map(clean);
      if (typeof obj === "object" && obj !== null) {
        removeKeys.forEach(k => delete obj[k]);
        Object.keys(obj).forEach(k => obj[k] = clean(obj[k]));
      }
      return obj;
    };

    result = clean(result);

    // ✅ FINAL RESPONSE
    return res.json({
      success: true,
      type,
      query: term,
      result,
      api_by: API_BY
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: err.message,
      api_by: API_BY
    });
  }
}
