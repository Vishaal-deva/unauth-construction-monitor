function todayISO() {
  // return something like "2026-09-17"
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export const sites = [
  {
    id: "site-0001",
    zoneName: "Adyar",
    lat: 13.0067,
    lng: 80.2570,
    status: "flagged",
    confidence: 0.87,
    areaSqm: 320,
    baselineImageDate: "2026-03-15",
    currentImageDate: todayISO(),
    permitOnFile: false
  },{
    id: "site-0002",
    zoneName: "Velachery",
    lat: 12.9756,
    lng: 80.2207,
    status: "reviewing",
    confidence: 0.86,
    areaSqm: 310,
    baselineImageDate: "2026-02-15",
    currentImageDate: todayISO(),
    permitOnFile: false
  },{
    id: "site-0003",
    zoneName: "Anna Nagar",
    lat: 	13.0850,
    lng: 80.2101,
    status: "confirmed",
    confidence: 0.85,
    areaSqm: 330,
    baselineImageDate: "2026-03-15",
    currentImageDate: todayISO(),
    permitOnFile: false
  },{
    id: "site-0004",
    zoneName: "T Nagar",
    lat: 	13.0428,
    lng: 80.2341,
    status: "confirmed",
    confidence: 0.80,
    areaSqm: 325,
    baselineImageDate: "2026-03-15",
    currentImageDate: todayISO(),
    permitOnFile: false
  },{
    id: "site-0005",
    zoneName: "Mylapore",
    lat: 	13.0368,
    lng: 80.2676,
    status: "confirmed",
    confidence: 0.85,
    areaSqm: 310,
    baselineImageDate: "2026-03-15",
    currentImageDate: todayISO(),
    permitOnFile: false
  }];

