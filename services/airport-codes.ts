import airportData from "@/data/airport-codes.json";

interface airportInfo {
	icao: string;
	iata: string;
	name: string;
	city: string;
	state: string;
	country: string;
	elevation: number;
	lat: number;
	lon: number;
	tz: string;
}

// TODO: Filter out the JSON array for unused data and check airport names

// TODO: Settings page that has colour scheme, time zone preferences, calendar name dropdown

export function getNameFromIATACode(IATACode: string) {
	const flatArray = Object.entries(airportData).flat();

	const filteredArray = flatArray.filter(
		(item) => typeof item !== "string",
	) as airportInfo[];

	const airportInfo = filteredArray.filter(
		(airport) => airport?.iata?.toUpperCase() === IATACode.toUpperCase(),
	);

	// TODO: error handling for no airport found and multiple airports found
	let airportName = airportInfo[0]?.name;

	//   Trim the 'Airport' off the string
	if (airportName?.endsWith("Airport")) {
		airportName = airportName.slice(0, -8);
	}

	return airportName;
}
