import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import Dropdown from "./Dropdown";
import { useState } from "react";
const WIND_SPEED = "WIND_SPEED";
const WIND_GUST = "WIND_GUST";
const VISIBILITY = "VISIBILITY";
const BARO = "BARO";
const TEMPERATURE = "TEMPERATURE";
const GLOBAL = "GLOBAL";
const COUNTRY = "COUNTRY";
const CONTINENT = "CONTINENT";

const ExtremeWeather = () => {
    const [userSelection, setUserSelection] = useState({ weather: WIND_SPEED, scope: GLOBAL });
    const [weatherActive, setWeatherActive] = useState({
        WIND_SPEED: true,
        WIND_GUST: false,
        VISIBILITY: false,
        BARO: false,
        TEMPERATURE: false,
    });
    const [scopeActive, setScopeActive] = useState({ GLOBAL: true, COUNTRY: false, CONTINENT: false });
    const [showDropDown, setShowDropDown] = useState(false);

    const option = [
        { name: "Global", code: "GB" },
        { name: "Continent", code: "CT" },
        { name: "Country", code: "CY" },
    ];

    const buttonClasses = "p-1 rounded text-blue-500 text-lg hover:text-white hover:bg-blue-500 duration-100";
    const activeButtonClass = "p-1 rounded text-white bg-blue-500 text-lg";

    const scopeButtonClass =
        "p-1 text-lg bg-amber-400 rounded text-gray-600 hover:bg-green-600 hover:text-white duration-100";
    const activeScopeButtonClass = "p-1 text-lg bg-green-600 text-white rounded";

    const handleWeatherButtonClick = (arg) => {
        const updateSelection = {
            ...userSelection,
            weather: arg,
        };

        // set everything to false and set selected button to active
        const newObj = Object.assign({}, weatherActive);
        for (let key in newObj) {
            newObj[key] = false;
        }
        newObj[arg] = true;

        const updatedWeatherActive = {
            ...weatherActive,
            ...newObj,
        };

        setWeatherActive(updatedWeatherActive);
        setUserSelection(updateSelection);
    };
    const handleScopeButtonClick = (arg) => {
        const updatedSelection = {
            ...userSelection,
            scope: arg,
        };

        const newObj = Object.assign({}, scopeActive);
        for (let key in newObj) {
            newObj[key] = false;
        }
        newObj[arg] = true;

        const updatedScopeActive = {
            ...scopeActive,
            ...newObj,
        };
        if (arg === CONTINENT || arg === COUNTRY) {
            setShowDropDown(true);
        } else {
            setShowDropDown(false);
        }
        setScopeActive(updatedScopeActive);
        setUserSelection(updatedSelection);
    };

    return (
        <>
            <div className="bg-gray-200 ">
                <ExtremeWeatherHeroSection />
                <div className="flex items-center justify-center gap-10 p-3 mt-1 relative">
                    <button
                        onClick={() => handleWeatherButtonClick(WIND_SPEED)}
                        className={weatherActive.WIND_SPEED ? activeButtonClass : buttonClasses}
                    >
                        Wind Speed
                    </button>
                    <button
                        onClick={() => handleWeatherButtonClick(WIND_GUST)}
                        className={weatherActive.WIND_GUST ? activeButtonClass : buttonClasses}
                    >
                        Wind Gust
                    </button>
                    <button
                        onClick={() => handleWeatherButtonClick(VISIBILITY)}
                        className={weatherActive.VISIBILITY ? activeButtonClass : buttonClasses}
                    >
                        Visibility
                    </button>
                    <button
                        onClick={() => handleWeatherButtonClick(BARO)}
                        className={weatherActive.BARO ? activeButtonClass : buttonClasses}
                    >
                        Baro
                    </button>
                    <button
                        onClick={() => handleWeatherButtonClick(TEMPERATURE)}
                        className={weatherActive.TEMPERATURE ? activeButtonClass : buttonClasses}
                    >
                        Temperature
                    </button>
                    <div className="flex items-center justify-center gap-5">
                        <button
                            onClick={() => handleScopeButtonClick(GLOBAL)}
                            className={scopeActive.GLOBAL ? activeScopeButtonClass : scopeButtonClass}
                        >
                            Global
                        </button>
                        <button
                            onClick={() => handleScopeButtonClick(COUNTRY)}
                            className={scopeActive.COUNTRY ? activeScopeButtonClass : scopeButtonClass}
                        >
                            Country
                        </button>
                        <button
                            onClick={() => handleScopeButtonClick(CONTINENT)}
                            className={scopeActive.CONTINENT ? activeScopeButtonClass : scopeButtonClass}
                        >
                            Continent
                        </button>
                        <div>{showDropDown && <Dropdown options={option} className="absolute top-[5%]" />}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExtremeWeather;
