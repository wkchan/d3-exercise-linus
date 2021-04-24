import React, { FC, useEffect } from "react";
import * as d3 from "d3";
import "./SeaSurfaceWave.scss";
import { string } from "prop-types";

interface ISeaSurfaceWaveProps {
    width: number,
    left: number,
    right: number,
    height: number,
    top: number,
    bottom: number,
    fill: string
}

interface CSVData {
    datetime: string,
    sea_surface_wave_significant_height: string | number,
    air_temperature_at_2m_above_ground_level: number,
    wind_from_direction_at_10m_above_ground_level: number,
    wind_speed_at_10m_above_ground_level: number
}

interface JSONBody {
    sea_surface_wave_from_direction_at_variance_spectral_density_maximum?: number,
    surface_sea_water_speed?: number,
    sea_surface_wave_maximum_height?: number


}

interface JSONData {
    datetime: string,
    values: JSONBody
}

const SeaSurfaceWave: FC<ISeaSurfaceWaveProps> = (props: ISeaSurfaceWaveProps) => {


    useEffect(() => {

        draw();

        return function cleanup() {
            eraseDrawing();
        };

    })

    const isNumber = (value: string | number): boolean => {
        return ((value != null) &&
            (value !== '') &&
            !isNaN(Number(value.toString())));
    };

    const eraseDrawing = () => {
        const svg = d3
            .select('.seaSurfaceWave')
            .selectChild('svg')
            .remove()
    }


    const draw = () => {

        const width = props.width - props.left - props.right
        const height = props.height - props.top - props.bottom




        // const csvSource: CSVData = d3.json('/data.csv', (d: CSVData) => {
        //     const res = (d as unknown) as CSVData
        //     console.log(res)
        // });

        const svg = d3
            .select('.seaSurfaceWave')
            .append('svg')
            .attr('width', width + props.left + props.right)
            .attr('height', height + props.top + props.bottom)
            .append('g')
            .attr('transform', `translate(${props.left},${props.top})`)

        d3.csv('/data.csv', (d) => {
            const res = (d as unknown) as CSVData

            const date = d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(res.datetime)
            let sea_surface_wave_significant_height

            if (isNumber(res.sea_surface_wave_significant_height)) {
                sea_surface_wave_significant_height = Number(res.sea_surface_wave_significant_height)

            } else {
                sea_surface_wave_significant_height = 0
            }
            const air_temperature_at_2m_above_ground_level = Number(res.air_temperature_at_2m_above_ground_level)
            const wind_from_direction_at_10m_above_ground_level = Number(res.wind_from_direction_at_10m_above_ground_level)
            const wind_speed_at_10m_above_ground_level = Number(res.wind_speed_at_10m_above_ground_level)
            return {
                date,
                sea_surface_wave_significant_height,
                air_temperature_at_2m_above_ground_level,
                wind_from_direction_at_10m_above_ground_level,
                wind_speed_at_10m_above_ground_level
            }

        }).then((data) => {
            const x = d3
                .scaleTime()
                .domain(
                    d3.extent(data, (d) => {
                        return d.date
                    }) as [Date, Date]
                )
                .range([0, width])

            svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x))

            const y = d3
                .scaleLinear()
                .domain([
                    0,
                    d3.max(data, (d) => {
                        console.log(d.sea_surface_wave_significant_height)
                        if (isNumber(d.sea_surface_wave_significant_height)) {
                            return +d.sea_surface_wave_significant_height
                        } else {
                            return 0
                        }
                    }),
                ] as number[])
                .range([height, 0])
            svg.append('g').call(d3.axisLeft(y))
            svg
                .append('path')
                .datum(data)
                .attr('fill', props.fill)
                .attr('stroke', 'white')
                .attr('stroke-width', 1.6)
                .attr(
                    'd',
                    // @ts-ignore
                    d3.area()
                        .curve(d3.curveLinear)
                        .x((d) => {
                            return x(((d as unknown) as { date: number }).date)
                        })
                        .y0(y(0))
                        .y1((d) => {
                            return y(((d as unknown) as { sea_surface_wave_significant_height: number }).sea_surface_wave_significant_height)
                        })
                )
        })
    }
    return <div className="seaSurfaceWave" />
};

SeaSurfaceWave.propTypes = {
};

export default SeaSurfaceWave;