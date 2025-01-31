import React, { useEffect, useState } from "react";
import { useFetchMetarByICAOQuery } from "@/store";
import AirportDetailWeatherPanel from "./AirportDetailWeatherPanel";

function AirportDetailWeatherSection({ icao }) {
    const [skipRender, setSkipRender] = useState(true);
    const [ICAO, setICAO] = useState("");
    useEffect(() => {
        if (icao) {
            setICAO(icao);
            setSkipRender(false);
        }
    }, [icao]);
    
    const { data: metar, error, isFetching } = useFetchMetarByICAOQuery({ icao: ICAO, decode: true }, {
        skip: skipRender,
        refetchOnMountOrArgChange: true,
    });
    
    
    if (error) {
        return (
            <div>
                Unable to fetch weather for {icao.toUpperCase()}
            </div>
        );
    }
    
    if (isFetching) {
        return (
            <div>
                Fetching weather for {icao.toUpperCase()}
            </div>
        );
    }
    
    if (metar) {
        if (metar.data && metar.results !== 0) {
            const { data } = metar;
            const {
                conditions = [],
                clouds,
                flight_category,
                raw_text,
                temperature,
                dewpoint,
                icao: MetarICAO,
                humidity,
                wind,
                visibility,
                barometer,
                
            } = data[0];
            const renderRawText = (
                // Limit the width here to show the click chevron
                <div className="w-[95%]">
                    {raw_text}
                </div>
            );
            return (
                <div className="w-auto">
                    <AirportDetailWeatherPanel
                        raw_text={renderRawText}
                        flightCategory={flight_category}
                        temperature={temperature}
                        dewpoint={dewpoint}
                        barometer={barometer}
                        clouds={clouds}
                        conditions={conditions}
                        humidity={humidity}
                        wind={wind}
                        visibility={visibility}
                    />
                </div>
            );
        }
    }
}

export default AirportDetailWeatherSection;
