// This accordion will display basic information of airport
import React from "react";
import { Link } from "react-router-dom";
import AirportDetail from "./AirportDetail";

function AirportAccordion({ airport }) {
    const {
        ICAO, iata, station,
    } = airport;
    
    const icaoAndIata = iata.length === 0 ? <div>{ICAO}</div> : <div>{ICAO} / {iata}</div>;
    
    return (
        <div className="grid grid-cols-4 w-[1080px] h-full text-lg p-3 mt-2.0 border-2 rounded-xl items-center justify-between bg-gray-100 drop-shadow-md">
            <div className="text-center">
                <div className="text-gray-500 font-bold">ICAO/IATA</div>
                <div className="contrast-500">{icaoAndIata}</div>
            </div>
            <div className="text-center">
                <div className="text-gray-500 font-bold">Name</div>
                <div>{station.name}</div>
            </div>
            <div className="text-center">
                <div className="text-gray-500 font-bold">Location</div>
                <div>{station.city}, {station.region.region_name}, {station.country.country_name}</div>
            </div>
            <div className="text-center">
                <Link
                    to="/airport/detail"
                    state={{ airportData: airport }}
                    className="rounded-lg bg-green-400 py-1 px-3 hover:bg-yellow-400 hover:no-underline "
                >Go to
                    Airport
                </Link>
            </div>
        </div>
    );
}

export default AirportAccordion;
