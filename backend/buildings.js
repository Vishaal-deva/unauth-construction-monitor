export function polygonAreaSqm(pts) {
  const R = 6371000;
  const lat0 = (pts[0].lat * Math.PI) / 180;
  const xy = pts.map((p) => [
    ((p.lon * Math.PI) / 180) * R * Math.cos(lat0),
    ((p.lat * Math.PI) / 180) * R,
  ]);
  let a = 0;
  for (let i = 0; i < xy.length; i++) {
    const [x1, y1] = xy[i];
    const [x2, y2] = xy[(i + 1) % xy.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a / 2);
}

export async function buildingsHandler(req, res) {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radius = Number(req.query.radius ?? 200);
  const minArea = Number(req.query.minArea ?? 0);
  const maxArea = Number(req.query.maxArea ?? Infinity);

  if ([lat, lng, radius, minArea].some(Number.isNaN) || Number.isNaN(maxArea)) {
    return res.status(400).json({ error: "lat, lng, radius, minArea, maxArea must be numbers" });
  }
  if (radius <= 0 || radius > 1000) {
    return res.status(400).json({ error: "radius must be between 1 and 1000 metres" });
  }

  const query = `[out:json][timeout:25];way["building"](around:${radius},${lat},${lng});out geom tags;`;
  try {
    const r = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "unauth-construction-monitor/1.0",
      },
      body: "data=" + encodeURIComponent(query),
    });
    if (!r.ok) return res.status(502).json({ error: `Overpass returned ${r.status}` });
    const data = await r.json();

    const buildings = data.elements
      .filter((e) => e.geometry && e.geometry.length >= 3)
      .map((e) => ({
        id: `way-${e.id}`,
        areaSqm: Math.round(polygonAreaSqm(e.geometry)),
        lat: e.geometry.reduce((s, p) => s + p.lat, 0) / e.geometry.length,
        lng: e.geometry.reduce((s, p) => s + p.lon, 0) / e.geometry.length,
        type: e.tags?.building ?? "yes",
        name: e.tags?.name ?? null,
        polygon: e.geometry.map((p) => [p.lat, p.lon]),
      }))
      .filter((b) => b.areaSqm >= minArea && b.areaSqm <= maxArea);

    res.json({ centre: { lat, lng }, radius, count: buildings.length, buildings });
  } catch (err) {
    res.status(502).json({ error: "Could not reach Overpass", detail: String(err) });
  }
}
