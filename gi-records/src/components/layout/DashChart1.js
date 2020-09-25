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

const DashChart1 = (props) => {

    // const [marketRate, setMarketRate] = useState([])
    // const [theMonths, setTheMonths] = useState([])

    var marketRate = []
    var theMonths = []

    const fetch = async () => {
        marketRate = []
        theMonths = []


        var docID = props.city + props.locality + props.state
        console.log("Doc ID: ", docID)
        //FIRESTORE FETCH FUNCTION HERE
        await db.collection('rates').doc(docID)
            .get()
            .then(snapshot => {
                const data = snapshot.data()
                console.log("DOC ID", data)
                marketRate = data.marketRate
                theMonths = data.dates
                console.log("The months: ", theMonths)
                for (var i = 0; i < marketRate.length; i++) {
                    marketRate[i] = parseFloat(marketRate[i]) * props.landSize
                    theMonths[i] = theMonths[i].toDate().toDateString()
                }
            }).catch(error => console.log(error))


        console.log("Market rate: ", marketRate)

        var len = marketRate.length

        console.log("Market rate length: ", marketRate.length)

        const myChartRef = chartRef.current.getContext("2d");

        new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: theMonths,
                datasets: [
                    {
                        label: "MR",
                        data: marketRate,
                        borderWidth: 2,
                        borderColor: '#fff',
                        pointRadius: 3,
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

    useEffect(() => {
        fetch()
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

