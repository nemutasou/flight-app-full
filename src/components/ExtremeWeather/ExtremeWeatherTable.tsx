// noinspection JSUnusedGlobalSymbols
import React, { useState } from "react";
import {
    CgChevronDoubleDown, CgChevronDoubleUp,
} from "react-icons/cg";
import { useTable, useExpanded } from "react-table";
// import { useReactTable } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import {
    BARO,
    TEMPERATURE, VISIBILITY, WIND_GUST, WIND_SPEED,
} from "@/utils/selection_names";
import { useFetchWeatherMetarsQuery } from "@/store";
import Skeleton from "./Skeleton";
import { useTheme } from "@/hooks/ThemeContext";


function WeatherTable({ expandedContent }) {
    const darkMode = useTheme();
    const darkModeClass = darkMode
        ? "[&>*:nth-child(odd)]:bg-gray-500 [&>*:nth-child(even)]:bg-gray-700"
        : "[&>*:nth-child(odd)]:bg-blue-300 [&>*:nth-child(even)]:bg-orange-200";
    const darkModeThClass = darkMode
        ? "text-sm p-2 border-5 bg-red-400 md:text-xl"
        : "text-sm p-2 border-5 bg-red-300 md:text-xl";
    let columnsToRender;
    const [sortOrder, setSortOrder] = useState(1);
    const [rowData, setRowData] = useState(null);
    const [requestLimit, setRequestLimit] = useState(10);
    let requestParams = { limit: requestLimit };
    const { weather, scope, code } = useSelector((state) => state.extremeWeather.userSelection);
    if (weather === TEMPERATURE || weather === BARO) {
        requestParams = { ...requestParams, sort: sortOrder };
    }
    
    const {
        data: metars,
        error,
        isFetching,
    } = useFetchWeatherMetarsQuery({
        scope,
        weather,
        code,
        params: requestParams,
    }, { refetchOnMountOrArgChange: true });
    
    const handleDetailClick = (row) => {
        const updatedRowData = { ...rowData, ...row };
        setRowData(updatedRowData);
    };
    
    const renderExpandColumn = () => ({
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }) => (
            <span {...row.getToggleRowExpandedProps()}>
                {row.isExpanded ? <button>Hide</button>
                    : <button onClick={() => handleDetailClick(row)}>Details</button>}
            </span>
        ),
    });
    
    const weatherColumn = [
        { Header: "ICAO", accessor: "icao" },
        { Header: "Airport Name", accessor: "name" },
        { Header: "Temperature", accessor: "temp_c" },
        { Header: "Wind Speed", accessor: "wind_speed_kt" },
        { Header: "Wind Gust", accessor: "wind_gust_kt" },
        { Header: "Visibility", accessor: "visibility_statute_mi" },
        { Header: "Baro", accessor: "altim_in_hg" },
        { Header: "City", accessor: "municipality" },
    ];
    
    if (weather === WIND_SPEED) {
        columnsToRender = weatherColumn.filter((header) => (header.Header === "Wind Speed" || header.Header === "ICAO" || header.Header === "Airport Name"));
        columnsToRender.push({ Header: "Wind Data", accessor: "wind_data" });
        columnsToRender.push(renderExpandColumn());
    } else if (weather === WIND_GUST) {
        columnsToRender = weatherColumn.filter((header) => (header.Header === "Wind Gust" || header.Header === "ICAO" || header.Header === "Airport Name"));
        columnsToRender.push({ Header: "Wind Data", accessor: "wind_data" });
        columnsToRender.push(renderExpandColumn());
    } else if (weather === VISIBILITY) {
        columnsToRender = weatherColumn.filter((header) => (header.Header === "Visibility" || header.Header === "ICAO" || header.Header === "Airport Name"));
        columnsToRender.push(renderExpandColumn());
    } else if (weather === BARO) {
        columnsToRender = weatherColumn.filter((header) => (header.Header === "Baro" || header.Header === "ICAO" || header.Header === "Airport Name"));
        columnsToRender.push(renderExpandColumn());
    } else if (weather === TEMPERATURE) {
        columnsToRender = weatherColumn.filter((header) => (header.Header === "Temperature" || header.Header === "ICAO" || header.Header === "Airport Name"));
        columnsToRender.push(renderExpandColumn());
    }
    
    const columns = React.useMemo(() => columnsToRender, [weather]);
    const weatherRow = React.useMemo(() => {
        if (isFetching === false && metars) {
            // add wind data if weather selection is either wind speed or wind gust
            if (weather === WIND_SPEED || weather === WIND_GUST) {
                const tempWeatherRow = metars.data.map((metar) => {
                    let updatedMetar = {};
                    let gust = "";
                    if (!metar.wind.gust_kts) {
                        gust = 0;
                    } else {
                        gust = `${metar.wind.gust_kts}`;
                    }
                    
                    const windData = `${metar.wind.degrees}/${metar.wind.speed_kts}${gust !== 0 ? `G${gust}` : ""}`;
                    updatedMetar = {
                        ...metar,
                        name: metar.station.location.name,
                        wind_data: windData,
                        wind_gust_kt: `${gust} Kt`,
                        wind_speed_kt: `${metar.wind.speed_kts} Kt`,
                    };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            // add meters to visibility field
            if (weather === VISIBILITY) {
                const tempWeatherRow = metars.data.map((metar) => {
                    let updatedMetar = {};
                    const updatedVisibility = `${metar.visibility.miles_float} mi / ${metar.visibility.meters_float} m`;
                    updatedMetar = {
                        ...metar,
                        visibility_statute_mi: updatedVisibility,
                        name: metar.station.location.name,
                    };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            // add inHg and QNH to baro field
            if (weather === BARO) {
                const tempWeatherRow = metars.data.map((metar) => {
                    let updatedMetar = {};
                    const updatedBaro = `${metar.barometer.hg} inHg / ${metar.barometer.hpa} QNH`;
                    updatedMetar = { ...metar, altim_in_hg: updatedBaro, name: metar.station.location.name };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            // add celsius symbol to temperature field
            if (weather === TEMPERATURE) {
                const tempWeatherRow = metars.data.map((metar) => {
                    let updatedMetar = {};
                    const updatedTemp = `${metar.temp_c} ${"\u00b0"}C`;
                    updatedMetar = { ...metar, temp_c: metar.temperature.celsius, name: metar.station.location.name };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            return metars.data;
        }
        return [];
    }, [metars, isFetching, error]);
    const tableInstance =  useTable({ columns, data: weatherRow }, useExpanded);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        visibleColumns,
        state: { expanded },
    } = tableInstance;
    
    if (isFetching) {
        return <Skeleton className="h-8 w-auto" times={10} />;
    }
    if (error) {
        return <div>Error</div>;
    }
    
    const handleSortClick = () => {
        setSortOrder(Number(sortOrder) * -1);
    };
    
    const handleLoadMoreData = () => {
        setRequestLimit(requestLimit + 10);
    };
    
    const handleSetDataToDefault = () => {
        setRequestLimit(10);
    };
    
    
    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <table
                {...getTableProps()}
            >
                <thead>
                    {/* TODO fix key specification  */}
                    {headerGroups.map((headerGroup, index) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                            {headerGroup.headers.map((column, index) => {
                                if (column.Header === "Baro") {
                                    return (
                                        <th
                                            {...column.getHeaderProps()}
                                            className={darkModeThClass}
                                            onClick={handleSortClick}
                                            key={index}
                                        >
                                            <div className="flex items-center justify-center hover:cursor-pointer">
                                                {column.render("Header")}
                                                {sortOrder === -1 ? <CgChevronDoubleDown />
                                                    : <CgChevronDoubleUp />}
                                            </div>
                                        </th>
                                    );
                                }
                                    
                                if (column.Header === "Temperature") {
                                    return (
                                        <th
                                            {...column.getHeaderProps()}
                                            className={darkModeThClass}
                                            onClick={handleSortClick}
                                            key={index}
                                        >
                                            <div className="flex items-center justify-center hover:cursor-pointer">
                                                {column.render("Header")}
                                                {sortOrder === -1 ? <CgChevronDoubleDown />
                                                    : <CgChevronDoubleUp />}
                                            </div>
                                        </th>
                                    );
                                }
                                    
                                return (
                                    <th
                                        key={index}
                                        {...column.getHeaderProps()}
                                        className={darkModeThClass}
                                    >
                                        {column.render("Header")}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody
                    {...getTableBodyProps()}
                    className={darkModeClass}
                >
                    {rows.map((row) => {
                        prepareRow(row);
                        const rowProps = row.getRowProps();
                        delete rowProps.role;
                        return (
                            <React.Fragment key={rowProps.key} {...rowProps}>
                                <tr
                                    className="text-sm text-center md:text-xl"
                                >
                                    {row.cells.map((cell, index) => (
                                        <td
                                            key={index}
                                            {...cell.getCellProps()}
                                            className="p-5"
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    ))}
                                </tr>
                                {row.isExpanded ? (
                                    <tr>
                                        <td colSpan={visibleColumns.length}>
                                            {expandedContent({ row })}
                                        </td>
                                    </tr>
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
            <div className="flex justify-center gap-3">
                <button
                    onClick={handleLoadMoreData}
                    className="px-2 py-1 bg-green-500 rounded-xl text-lg hover:bg-amber-400 shadow-2xl"
                >
                    Load More...
                </button>
                <button
                    onClick={handleSetDataToDefault}
                    className="px-2 py-1 bg-red-400 rounded-xl text-lg hover:bg-amber-400 shadow-2xl "
                >
                    Set Default
                </button>
            </div>
        </div>
    );
}

export default WeatherTable;
