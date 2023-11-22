import React, { useEffect } from "react"
import { Chart } from "chart.js";
export default function Example() {
    useEffect(() => {
        const canvas2 = document.getElementById('myChart2') as HTMLCanvasElement;
        const ctx2 = canvas2.getContext('2d') as CanvasRenderingContext2D;
        var myChart2 = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: ["Accepted", "Pending", "Rejected"],
                datasets: [{
                    data: [70, 10, 6],
                    borderColor: [
                        "rgb(75, 192, 192)",
                        "rgb(255, 205, 86)",
                        "rgb(255, 99, 132)",
                    ],
                    backgroundColor: [
                        "rgb(75, 192, 192 )",
                        "rgb(255, 205, 86)",
                        "rgb(255, 99, 132)",
                    ],
                    borderWidth: 2,
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        display: false,
                    }],
                    yAxes: [{
                        display: false,
                    }],
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Custom Chart Title',
                        padding: {
                            top: 10,
                            bottom: 30
                        }
                    }
                }
            },

        });
    }, [])


    return (
        <>
            {/* Pie chart */}
            <h1 className="w-[150px] mx-auto mt-10 text-xl font-semibold capitalize ">Pie Chart</h1>
            <div className="w-[1100px] h-fit flex mx-auto my-auto">
                <div className='border border-gray-400 pt-0 rounded-xl w-full h-fit my-auto  shadow-xl pb-2'>
                    <canvas id='myChart2'></canvas>
                </div>
            </div>
        </>
    )
}

