import React, { Component } from 'react'
import Chart from "chart.js";


export default class LineGraph extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");

        new Chart(myChartRef, {
            type: "bar",
            data: {
                //Bring in data
                labels: ["test1", "test2", "test3", "test4", "test5"],
                datasets: [
                    {
                        label: "Sales",
                        data: [50, 30, 20, 67, 23],
                        borderWidth: 2,
                        borderColor: '#fff',
                        pointRadius: 2,
                        pointBackgroundColor: '#000000',
                        pointStyle: 'circle',
                        pointBorderColor: '#000000'
                    }
                ]
            },
            options: {
                layout: {
                    padding: {
                        left: -10,
                        bottom: -10
                    }
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        ticks: { 
                            display: false,
                            min: 0
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: { 
                            display: false,
                            min: 0
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                }
            },
        });
    }
    render() {
        return (
            <div>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}

