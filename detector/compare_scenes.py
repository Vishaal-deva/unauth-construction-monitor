import os
from datetime import datetime, timedelta, timezone

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import planetary_computer as pc
import rasterio
from pystac_client import Client
from rasterio.warp import transform_bounds
from rasterio.windows import from_bounds

LAT, LNG, D = 13.0067, 80.2570, 0.01   # Adyar, about 2 km box
BBOX = [LNG - D, LAT - D, LNG + D, LAT + D]

catalog = Client.open(
    "https://planetarycomputer.microsoft.com/api/stac/v1",
    modifier=pc.sign_inplace,
)

def find(dt_range, newest=False):
    items = list(catalog.search(
        collections=["sentinel-2-l2a"], bbox=BBOX, datetime=dt_range,
        query={"eo:cloud_cover": {"lt": 20}},
    ).items())
    if not items:
        return None
    if newest:
        return max(items, key=lambda i: i.datetime)
    return min(items, key=lambda i: i.properties["eo:cloud_cover"])

def crop(item):
    href = item.assets["visual"].href
    with rasterio.open(href) as src:
        b = transform_bounds("EPSG:4326", src.crs, *BBOX)
        win = from_bounds(*b, transform=src.transform)
        arr = src.read([1, 2, 3], window=win)
    return np.moveaxis(arr, 0, -1)

now = datetime.now(timezone.utc)
current = find(f"{now - timedelta(days=14):%Y-%m-%d}/{now:%Y-%m-%d}", newest=True)
baseline = find("2025-10-01/2025-11-15")

if current is None or baseline is None:
    raise SystemExit("Could not find both scenes. Try widening the date ranges or cloud limit.")

print("baseline:", baseline.datetime.date(), baseline.id)
print("current: ", current.datetime.date(), current.id)

a, b = crop(baseline), crop(current)
h, w = min(a.shape[0], b.shape[0]), min(a.shape[1], b.shape[1])
a, b = a[:h, :w], b[:h, :w]
diff = np.abs(b.astype(int) - a.astype(int)).mean(axis=2)

os.makedirs("outputs", exist_ok=True)
fig, ax = plt.subplots(1, 3, figsize=(15, 5.5))
ax[0].imshow(a, interpolation="nearest"); ax[0].set_title(f"Baseline {baseline.datetime.date()}")
ax[1].imshow(b, interpolation="nearest"); ax[1].set_title(f"Current {current.datetime.date()}")
im = ax[2].imshow(diff, cmap="inferno", interpolation="nearest"); ax[2].set_title("Change (brighter = more change)")
for x in ax: x.axis("off")
fig.colorbar(im, ax=ax[2], fraction=0.046)
plt.tight_layout()
plt.savefig("outputs/compare.png", dpi=130)
print("saved outputs/compare.png")
