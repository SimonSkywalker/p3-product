import React, { useEffect } from "react"
import { Chart } from "chart.js";

interface ChartProps {
    questionName: string
    questionIndex: number
    roles: any[]
    answerCount: {}
}

export default function PieChart({ questionName, questionIndex, roles, answerCount } : ChartProps) {

    let randomBackgroundColor : any = [];
    let usedColors = new Set();

    let dynamicColors = function() {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        let color = "rgb(" + r + "," + g + "," + b + ")";

        if (!usedColors.has(color)) {
            usedColors.add(color);
            return color;
        } else {
            return dynamicColors();
        }
    };

    for ( let i in roles) {
        randomBackgroundColor.push(dynamicColors());
    }
    useEffect(() => {
        const canvas = document.getElementById(`myChart${questionIndex}`) as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: roles,
                datasets: [{
                    data: Object.values(answerCount) as [],
                    backgroundColor: randomBackgroundColor,
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
            <h1 className="mx-auto mt-10 text-xl font-semibold capitalize ">{questionName}</h1>
            <div className="w-[1100px] h-fit flex mx-auto my-auto">
                <div className='border border-gray-400 pt-0 rounded-xl w-full h-fit my-auto  shadow-xl pb-2'>
                    <canvas id={`myChart${questionIndex}`}></canvas>
                </div>
            </div>
        </>
    )
}

