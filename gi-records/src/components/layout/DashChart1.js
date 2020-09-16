import React, { Component } from 'react'
import Chart from "chart.js";
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'

const month = new Date().getMonth()
const year = new Date().getFullYear()

 class LineGraph extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");

        new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: ["Jan", "Feb", "March"],
                datasets: [
                    {
                        label: "Sales",
                        data: [86, 67, 91],
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
                        ticks: { display: false },
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: { display: false },
                        gridLines: {
                            display: false
                        }
                    }]
                }
            },
        });
    }
    render() {
        console.log("Props of Line graph: ", this.props)
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

const mapStateToProps = (state) => {
    console.log("State: ", state)
    return {
        auth: state.firebase.auth,
        chartData: state.firestore.ordered.chartData
    }
}

export default compose(
    connect(mapStateToProps, null),
    firestoreConnect((props) => [
        { collection: 'rates', orderBy: ['createdAt', 'desc'], where: [['year', '==', year]], storeAs: 'chartData' },
    ])
)(LineGraph)

