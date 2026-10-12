from datetime import datetime, timedelta, timezone
from pystac_client import Client
import planetary_computer as pc

LAT, LNG = 13.0067, 80.2570   # Adyar test area
D = 0.01                      # about 1 km around the centre
bbox = [LNG - D, LAT - D, LNG + D, LAT + D]

end = datetime.now(timezone.utc)
start = end - timedelta(days=120)

catalog = Client.open(
    "https://planetarycomputer.microsoft.com/api/stac/v1",
    modifier=pc.sign_inplace,
)
search = catalog.search(
    collections=["sentinel-2-l2a"],
    bbox=bbox,
    datetime=f"{start:%Y-%m-%d}/{end:%Y-%m-%d}",
    query={"eo:cloud_cover": {"lt": 30}},
)
items = sorted(search.items(), key=lambda i: i.datetime)

print(f"{len(items)} clear Sentinel-2 scenes in the last 120 days:")
for it in items:
    print(it.datetime.date(), f"cloud {it.properties['eo:cloud_cover']:.0f}%", it.id)
