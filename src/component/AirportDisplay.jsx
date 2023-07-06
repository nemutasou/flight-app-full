import React from "react";

/*eslint-disable*/
function AirportDisplay({ airport }) {
    console.log(airport);
    const {
        ICAO, elevation, station, name, runways, transitionAltitude
    } = airport;
    const renderedRunways = runways.map((runway) => (
            <div key={runway._id}>
                {runway.runway_id}
                <br />
                {runway.ilsFreq === 0 ? "No ILS" : `ILS Freq: ${runway.ilsFreq}`}
            </div>
    ));
    return (
            <div>
                ICAO:
                {" "}
                {ICAO}
                <br />
                Elevation:
                {" "}
                {elevation}
                <br />
                Name:
                {" "}
                {name}
                <br />
                {renderedRunways}
                <br />
                TransitionAltitude:
                {" "}
                {transitionAltitude}
                <hr />
            </div>
    );
}

export default AirportDisplay;
