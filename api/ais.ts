import WebSocket from "ws";

const AIS_URL = "wss://stream.aisstream.io/v0/stream";
const LOOKUP_TIMEOUT_MS = 12000;

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const raw = Array.isArray(req.query?.mmsi) ? req.query.mmsi[0] : req.query?.mmsi;
  const mmsi = String(raw || "").trim();

  if (!/^\d{9}$/.test(mmsi)) {
    return res.status(400).json({ error: "A valid 9-digit MMSI is required." });
  }

  const apiKey = process.env.AISSTREAM_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "DMA Vessel Intelligence is ready, but the free AISStream API key has not been added to the server yet."
    });
  }

  let socket: WebSocket | null = null;
  let settled = false;

  const finish = (status: number, payload: any) => {
    if (settled) return;
    settled = true;
    try { socket?.close(); } catch {}
    res.status(status).json(payload);
  };

  const timer = setTimeout(() => {
    finish(404, {
      error: "No fresh AIS message was received for this MMSI during the lookup window. The vessel may be out of coverage, not transmitting, or between AIS reports. Try again shortly."
    });
  }, LOOKUP_TIMEOUT_MS);

  try {
    socket = new WebSocket(AIS_URL, { perMessageDeflate: true });

    socket.on("open", () => {
      socket?.send(JSON.stringify({
        APIKey: apiKey,
        BoundingBoxes: [[[90, -180], [-90, 180]]],
        FiltersShipMMSI: [mmsi],
        FilterMessageTypes: ["PositionReport", "StandardClassBPositionReport", "ExtendedClassBPositionReport"]
      }));
    });

    socket.on("message", (buffer) => {
      try {
        const event = JSON.parse(buffer.toString());
        if (event.MessageType === "SubscriptionConfirmation") return;

        const meta = event.MetaData || {};
        const message =
          event.Message?.PositionReport ||
          event.Message?.StandardClassBPositionReport ||
          event.Message?.ExtendedClassBPositionReport;

        if (!message) return;
        if (String(meta.MMSI ?? message.UserID ?? "") !== mmsi) return;

        clearTimeout(timer);
        finish(200, {
          mmsi,
          shipName: meta.ShipName || "",
          latitude: Number(meta.Latitude ?? message.Latitude),
          longitude: Number(meta.Longitude ?? message.Longitude),
          sog: Number.isFinite(Number(message.Sog)) ? Number(message.Sog) : undefined,
          cog: Number.isFinite(Number(message.Cog)) ? Number(message.Cog) : undefined,
          heading: Number.isFinite(Number(message.TrueHeading)) ? Number(message.TrueHeading) : undefined,
          receivedAt: new Date().toISOString(),
          source: "AISStream"
        });
      } catch {
        // Ignore malformed/non-target messages and continue listening.
      }
    });

    socket.on("error", () => {
      clearTimeout(timer);
      finish(502, { error: "The AIS data service could not be reached. Please try again." });
    });

    socket.on("close", () => {
      if (!settled) {
        clearTimeout(timer);
        finish(502, { error: "The AIS data stream closed before a vessel position was received." });
      }
    });
  } catch {
    clearTimeout(timer);
    finish(500, { error: "Unable to start the vessel lookup." });
  }
}
