import React from "react";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import { Pagination } from "rsuite";
import AirportDisplay from "./AirportDisplay";
import AirportAccordion from "./AirportAccordion";
import PaginationCustom from "./PaginationCustom";
import PaginationButtons from "./PaginationButton";


function AirportsList({ airports }) {
    const [prev, setPrev] = React.useState(true);
    const [next, setNext] = React.useState(true);
    const [first, setFirst] = React.useState(true);
    const [last, setLast] = React.useState(true);
    const [ellipsis, setEllipsis] = React.useState(true);
    const [boundaryLinks, setBoundaryLinks] = React.useState(true);
    const [activePage, setActivePage] = React.useState(1);
    const [size, setSize] = React.useState("xs");
    const [maxButtons, setMaxButtons] = React.useState(5);
    const [total, setTotal] = React.useState(200);
    const [layout, setLayout] = React.useState(["total", "-", "limit", "|", "pager", "skip"]);
    const [limit, setLimit] = React.useState(50);
    
    
    const { data } = airports;
    console.log(data);
    const renderedAirports = data.airports.map((airport) => (
        <div key={airport.ICAO}>
            <AirportAccordion airport={airport} />
        </div>
    ));
    
    const showGoToPage = (page) => {
        console.log("GO TO PAGE", page);
    };
    
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col gap-4 p-10 items-center ">{renderedAirports}</div>
            {/* <Pagination */}
            {/*    layout={layout} */}
            {/*    size={size} */}
            {/*    prev={prev} */}
            {/*    next={next} */}
            {/*    first={first} */}
            {/*    last={last} */}
            {/*    ellipsis={ellipsis} */}
            {/*    boundaryLinks={boundaryLinks} */}
            {/*    total={total} */}
            {/*    limit={limit} */}
            {/*    limitOptions={[30, 40]} */}
            {/*    maxButtons={maxButtons} */}
            {/*    activePage={activePage} */}
            {/*    onChangePage={setActivePage} */}
            {/*    onChangeLimit={setLimit} */}
            {/* /> */}
            <Pagination
                // layout={["total", "|", "", "page", "skip"]}
                total={data.totalAirports}
                ellipsis={5 >= 1}
                activePage={3}
                limit={data.limit}
                next={data.nextPage !== null}
                prev={data.prevPage !== null}
                first={5 > 1}
                last={5 > 1}
                boundaryLinks={5 > 1}
                maxButtons={5}
            />
        </div>
    );
}

export default AirportsList;
