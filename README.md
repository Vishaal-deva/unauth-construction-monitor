# Unauthorized Construction Monitor. Find the building that shouldn't be there.

### Satellite map, real building footprints, and a path to change detection, for municipal inspection.

![Status](https://img.shields.io/badge/status-prototype-orange)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)
![Map](https://img.shields.io/badge/map-Leaflet-199900)
![Data](https://img.shields.io/badge/data-OpenStreetMap%20%7C%20Sentinel--2-blue)

**[Quick start](#quick-start) | [How it works](#how-it-works) | [Limitations](#limitations) | [Roadmap](#roadmap)**

Pick a point on the map. Set a radius and a building-size range. Get every mapped building inside it, outlined on satellite imagery with its area in square metres.

No neighbourhood-level dots. No black-box verdicts. No claims the data can't back.

---

## Why I built it

Unauthorized construction is usually found by inspectors walking the streets, which is slow and often happens after the slab is poured. I wanted to see how far free, open data gets you towards catching it earlier. This started from the PS27 problem statement, "Online monitoring of unauthorized construction across the city", and it is a working prototype of the GIS side.

> A flag is a reason to inspect, not proof of a violation.

## Quick start

### 1. Clone and install\

### 2. Run it
### 3. Open the dashboard
Go to http://localhost:3000, click the map to set a centre, and press **Scan**.

## How it works

- **Backend (Node.js and Express):** a REST API with automatic status rules (permit on file, detection confidence), and a `/api/buildings` endpoint that fetches building footprints and computes their areas from OpenStreetMap through the Overpass API.
- **Frontend (Leaflet):** satellite basemap, click-to-set centre, radius and size filters, footprint polygons and a results table.
- **Live satellite tools (`detector/`):** `list_scenes.py` lists recent Sentinel-2 scenes over an area through the Microsoft Planetary Computer STAC API. `compare_scenes.py` crops two dates of the same place and plots a change map (needs `rasterio`; runs well in Google Colab).

## Limitations

- Sites in `backend/data.js` are **sample data**, not real detections.
- Sentinel-2 is 10 m resolution. It can screen for large changes but cannot resolve single houses. Building-level detection needs about 0.5 m imagery (drone or commercial satellite).
- Plain colour differencing between dates is noisy (lighting, shadows, roofs). A built-up index and filtering are the next step.
- OpenStreetMap footprints are volunteer-mapped and can be incomplete or offset.
- Nothing here proves a violation. Every flag needs a human check against permits.

## Roadmap

- [x] Satellite basemap and building footprints for any centre and radius
- [x] Automatic status rules
- [x] Live Sentinel-2 scene lookup and before/after crop
- [ ] Smarter change detection (built-up and vegetation indices, filtering)
- [ ] Change-detection model on high-resolution before/after imagery
- [ ] Detections as map polygons feeding the status rules
- [ ] Before/after slider and detection timeline
- [ ] Alerts and PDF reports

## Data and attribution

Building footprints: (c) OpenStreetMap contributors (ODbL). Satellite tiles: Esri. Sentinel-2: ESA / Copernicus via Microsoft Planetary Computer.
