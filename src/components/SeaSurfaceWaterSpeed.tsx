import React, { FC, useEffect } from "react";
import * as d3 from "d3";
import "./SeaSurfaceWaterSpeed.scss";
import axios from 'axios';

interface ISeaSurfaceWaterSpeedProps {
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
    datetime: Date,
    sea_surface_wave_from_direction_at_variance_spectral_density_maximum: number,
    surface_sea_water_speed: number,
    sea_surface_wave_maximum_height: number,
}

const SeaSurfaceWaterSpeed: FC<ISeaSurfaceWaterSpeedProps> = (props: ISeaSurfaceWaterSpeedProps) => {


    const def_val = 0;



    const buildJSON = async () => {
        const rtnArray: ISeaSurfaceWaterSpeed[] = [];

        const response = await axios.get("./data.json");

        Object.keys(response.data).forEach(val => {
            const datetime: string = val;
            const body: JSONBody = response.data[val];
            const sea_surface_wave_from_direction_at_variance_spectral_density_maximum = body.sea_surface_wave_from_direction_at_variance_spectral_density_maximum || def_val;
            const surface_sea_water_speed = body.surface_sea_water_speed || def_val;
            const sea_surface_wave_maximum_height = body.sea_surface_wave_maximum_height || def_val;
            const record = { datetime: d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(datetime) || new Date(0), sea_surface_wave_from_direction_at_variance_spectral_density_maximum: sea_surface_wave_from_direction_at_variance_spectral_density_maximum, surface_sea_water_speed: surface_sea_water_speed, sea_surface_wave_maximum_height: sea_surface_wave_maximum_height };

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
            .select('.seaSurfaceWaterSpeed')
            .selectChild('svg')
            .remove()
    }


    const draw = async () => {

        console.log("waterspeed draw!");


        const data = await buildJSON();

        data.map((d) => {
            console.log(d.datetime.toISOString)
        });

        const width = props.width - props.left - props.right
        const height = props.height - props.top - props.bottom

        const svg = d3
            .select('.seaSurfaceWaterSpeed')
            .append('svg')
            .attr('width', width + props.left + props.right)
            .attr('height', height + props.top + props.bottom)
            .append('g')
            .attr('transform', `translate(${props.left},${props.top})`)

        const x = d3
            .scaleTime()
            .domain(
                d3.extent(data, (key) => {
                    return key.datetime
                }) as [Date, Date]
            )
            .range([0, width])

        svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x))

        const y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, (key) => {
                    return +key.surface_sea_water_speed
                }),
            ] as number[])
            .range([height, 0])

        svg.append('g').call(d3.axisLeft(y))

        svg
            .append('path')
            .datum(data)
            .attr('fill', "none")
            .attr('stroke', "black")
            .attr('stroke-width', 1.6)
            .attr(
                'd',
                // @ts-ignore
                d3.line()
                    .x((d) => {
                        return x(((d as unknown) as { datetime: number }).datetime)
                    })
                    .y((d) => {
                        return y(((d as unknown) as { surface_sea_water_speed: number }).surface_sea_water_speed)
                    })
            )
    }
    return <div className="seaSurfaceWaterSpeed" />
};

SeaSurfaceWaterSpeed.propTypes = {
};

export default SeaSurfaceWaterSpeed;

