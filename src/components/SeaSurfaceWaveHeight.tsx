import React, { FC, useEffect } from "react";
import * as d3 from "d3";
import "./SeaSurfaceWaveHeight.scss";
import axios from 'axios';
import alasql from 'alasql';

interface ISeaSurfaceWaveHeightProps {
    width: number,
    left: number,
    right: number,
    height: number,
    top: number,
    bottom: number,
    fill: string
}
interface JSONBody {
    sea_surface_wave_from_direction_at_variance_spectral_density_maximum?: number,
    surface_sea_water_speed?: number,
    sea_surface_wave_maximum_height?: number,

}

interface ISeaSurfaceWaterSpeed {
    datetime: string,
    sea_surface_wave_from_direction_at_variance_spectral_density_maximum: number,
    surface_sea_water_speed: number,
    sea_surface_wave_maximum_height: number,
}

interface IIntermediaData {
    datetime: string,
    sea_surface_wave_from_direction_at_variance_spectral_density_maximum: number,
    surface_sea_water_speed: number,
    sea_surface_wave_maximum_height: number,
    sea_surface_wave_significant_height: number,
    air_temperature_at_2m_above_ground_level: number,
    wind_from_direction_at_10m_above_ground_level: number,
    wind_speed_at_10m_above_ground_level: number
}

interface IAggregatedData {
    datetime: Date,
    sea_surface_wave_maximum_height: number,
    sea_surface_wave_significant_height: number
}

interface IDataModel {
    datetime: Date,
    name: string,
    value: number
}

const SeaSurfaceWaveHeight: FC<ISeaSurfaceWaveHeightProps> = (props: ISeaSurfaceWaveHeightProps) => {

    const def_val = -1;

    const isNumber = (value: string | number): boolean => {
        return ((value != null) &&
            (value !== '') &&
            !isNaN(Number(value.toString())));
    };

    const buildJSON = async () => {
        const rtnArray: ISeaSurfaceWaterSpeed[] = [];

        const response = await axios.get("./data.json");

        Object.keys(response.data).forEach(val => {
            const datetime: string = val;
            const body: JSONBody = response.data[val];
            const sea_surface_wave_from_direction_at_variance_spectral_density_maximum = body.sea_surface_wave_from_direction_at_variance_spectral_density_maximum || def_val;
            const surface_sea_water_speed = body.surface_sea_water_speed || def_val;
            const sea_surface_wave_maximum_height = body.sea_surface_wave_maximum_height || def_val;
            const record = { datetime: datetime || "null", sea_surface_wave_from_direction_at_variance_spectral_density_maximum: sea_surface_wave_from_direction_at_variance_spectral_density_maximum, surface_sea_water_speed: surface_sea_water_speed, sea_surface_wave_maximum_height: sea_surface_wave_maximum_height };

            rtnArray.push(record);

        });
        rtnArray.sort((recordA, recordB) => +new Date(recordA.datetime) - +new Date(recordB.datetime));

        return rtnArray;
    }

    useEffect(() => {
        draw();
        return function cleanup() {
            eraseDrawing();
        };
    })

    const eraseDrawing = () => {
        d3
            .select('.SeaSurfaceWaveHeight')
            .selectChild('svg')
            .remove()
    }

    const draw = async () => {

        const jsonArray = await buildJSON();

        alasql.promise([
            "select * from csv('./data.csv')",
            ["select * from ?", [jsonArray]]
        ])
            .then(result => {

                alasql.fn.datetime = (dateStr) => {
                    return d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(dateStr)
                };

                const tmpArray = alasql('SELECT * from ? myCSVArray OUTER JOIN ? myJSONArray USING datetime ORDER BY datetime ASC', result);
                const maximumData: IDataModel[] = [];
                const significantData: IDataModel[] = [];

                const arrgregateData: IAggregatedData[] = [];

                tmpArray.map((row: IIntermediaData) => {
                    const datetime: Date = d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(row.datetime) || new Date(0);
                    let sea_surface_wave_maximum_height = def_val;
                    let sea_surface_wave_significant_height = def_val;

                    if (isNumber(row.sea_surface_wave_maximum_height)) {
                        sea_surface_wave_maximum_height = Number(row.sea_surface_wave_maximum_height)

                    } else {
                        sea_surface_wave_significant_height = def_val
                    }

                    if (isNumber(row.sea_surface_wave_significant_height)) {
                        sea_surface_wave_significant_height = Number(row.sea_surface_wave_significant_height)

                    } else {
                        sea_surface_wave_significant_height = def_val
                    }

                    const maxRecord = { datetime: datetime, value: sea_surface_wave_maximum_height, name: "MAX" };
                    const significantRecord = { datetime: datetime, value: sea_surface_wave_significant_height, name: "SIGNIFICANT" };
                    const arrgregateRecord = { datetime: datetime, sea_surface_wave_significant_height: sea_surface_wave_significant_height, sea_surface_wave_maximum_height: sea_surface_wave_maximum_height };

                    maximumData.push(maxRecord);
                    significantData.push(significantRecord);
                    arrgregateData.push(arrgregateRecord);

                })

                const data: IDataModel[][] = [maximumData, significantData];
                const margin = ({ top: 0, right: 0, bottom: 0, left: 0 })
                const width = props.width - props.left - props.right
                const height = props.height - props.top - props.bottom
                const colors = ['#008080', '#5C9DE6', '#3C3C3C', '#1F1F1F', '#C0C0C0', '#A0A0A0', '#3A3A3A']

                const svg = d3
                    .select('.SeaSurfaceWaveHeight')
                    .append('svg')
                    .attr('width', width + props.left + props.right)
                    .attr('height', height + props.top + props.bottom)
                    .append('g')
                    .attr('transform', `translate(${props.left},${props.top})`)

                const xScale = d3
                    .scaleTime()
                    .domain(
                        d3.extent(data[0], (key) => {
                            return key.datetime
                        }) as [Date, Date]
                    )
                    .range([0, width])

                svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale))

                const yScale = d3
                    .scaleLinear()
                    .domain([
                        0,
                        d3.max(data.flat(), (key) => {
                            return +key.value + 1
                        }),
                    ] as number[])
                    .range([height, 0])

                svg.append('g').attr("transform", `translate(${margin.left},0)`)
                    .call(d3.axisLeft(yScale))
                    .call(g => g.select(".domain").remove())
                    .call(g => g.select(".tick:last-of-type text").clone()
                        .attr("x", 3)
                        .attr("text-anchor", "start")
                        .attr("font-weight", "bold")
                        .text('Water Level (m)'))


                const waterLevel = svg.selectAll('.waterLevel')
                    .data(data)
                    .enter()
                    .append('g')
                    .attr('class', 'waterLevel')
                    ;

                const pathLine = d3.line()
                    .x((d) => {
                        return xScale(((d as unknown) as { datetime: number }).datetime)
                    })
                    .y((d) => {
                        return yScale(((d as unknown) as { value: number }).value)
                    })
                    .defined((d) => {
                        const rtn = ((((d as unknown) as { value: number }).value) === def_val)
                        return !rtn
                    })

                waterLevel.append('path')
                    .attr('class', 'line')
                    .attr('fill', "none")
                    .attr('stroke', (d: IDataModel[], i: number) => {
                        return colors[i % colors.length];
                    })
                    .attr('stroke-width', 1.6)
                    .attr(
                        'd',
                        // @ts-ignore
                        pathLine
                    );

                svg.append("text")
                    .attr("x", (width / 2))
                    .attr("y", 0 - (margin.top / 2))
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .style("text-decoration", "underline")
                    .text("Sea Surface Wave Maximum Height and Significant Height vs Date Graph");

                svg.selectAll('text.label')
                    .data(data)
                    .join('text')
                    .attr('class', 'label')
                    .attr('x', width - margin.right - 50)
                    .attr(
                        'y',
                        (d: IDataModel[], i: number) => {
                            return (i * 50) + 100
                        }
                    )
                    .attr('dy', '0.35em')
                    .style('fill', (d: IDataModel[], i: number) => {
                        return colors[i % colors.length];
                    })
                    .style('font-family', 'sans-serif')
                    .style('font-size', 12)
                    .text(d => " - " + d[0].name);

            })
    }
    return <div className="SeaSurfaceWaveHeight" />
};

SeaSurfaceWaveHeight.propTypes = {
};

export default SeaSurfaceWaveHeight;

