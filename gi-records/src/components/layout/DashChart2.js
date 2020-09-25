import React, { useEffect, useState } from 'react'
import Chart from "chart.js";
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { db } from '../../config/fbConfig'

const month = new Date().getMonth()
const year = new Date().getFullYear()

var chartRef = React.createRef();

var months = {
    '1': 'Jan',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Apr',
    '5': 'May',
    '6': 'Jun',
    '7': 'Jul',
    '8': 'Aug',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
}
var len = 0

const DashChart1 = (props) => {

    const [marketRate, setMarketRate] = useState([])
    const [theMonths, setTheMonths] = useState([])

    useEffect(() => {

        console.log("Dashchart 1 props: ", props)


        //FIRESTORE FETCH FUNCTION HERE
        db.collection('rates')
            .where("year", "==", year)
            .where("locality", "==", props.locality)
            .orderBy("createdAt", "desc")
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data()
                    console.log("DOC ID", data)
                    marketRate.push(data.marketRate)
                    theMonths.push(data.month)
                })
                len = marketRate.length
            }).catch(error => console.log(error))


        console.log("Market rate: ", marketRate)

        console.log("Market rate length: ", len)

        const myChartRef = chartRef.current.getContext("2d");


        new Chart(myChartRef, {
            type: "bar",
            data: {
                //Bring in data
                labels: [months[theMonths[len - 1]], months[theMonths[len - 2]], months[theMonths[len - 3]], months[theMonths[len - 4]], months[theMonths[len - 5]]],
                datasets: [
                    {
                        label: "Sales",
                        data: [parseInt(marketRate[len - 1]), parseInt(marketRate[len - 2]), parseInt(marketRate[len - 3]), parseInt(marketRate[len - 4]), parseInt(marketRate[len - 5])],
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
    })

    return (
        <div>
            <canvas
                id="myChart"
                ref={chartRef}
            />
        </div>
    )
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
)(DashChart1)

