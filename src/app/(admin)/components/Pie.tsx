import React, { useEffect } from "react"
import { Chart, Tooltip } from "chart.js";

interface ChartProps {
    questionName: string
    questionIndex: number
    roles: any[]
    answerCount: {}
    answer2Count: {}
}

export default function PieChart({ questionName, questionIndex, roles, answerCount, answer2Count } : ChartProps) {

    let randomBackgroundColor : any = [];
    let randomBackgroundColor2 : any = [];
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
        randomBackgroundColor2.push(dynamicColors());

    }
    const datasetMaker = (object: any, object2: any): any[]=> {

        let tempArray = [];
    
        tempArray = [{
            data: Object.values(object) as [],
            label: 'Dataset 1',
            backgroundColor: randomBackgroundColor,
            borderWidth: 2
    
          },
          {
            label: 'Dataset 2',
            data: Object.values(object2) as [],
            backgroundColor: randomBackgroundColor,
            borderWidth: 2
          }]
        
        return tempArray;
      }
    let runOnce = false
    useEffect(() => {
        if (!runOnce) {
            const canvas = document.getElementById(`myChart${questionIndex}`) as HTMLCanvasElement;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            var myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: roles,
                    datasets: (Object.keys(answer2Count).length > 0) ? datasetMaker(answerCount, answer2Count) : [{
                        data: Object.values(answerCount) as [],
                        label: "Dataset 1",
                        backgroundColor: randomBackgroundColor,
                        borderWidth: 2,
                    }]
                    
                },
                options: {
                    responsive: true,
                    tooltips: {
                        callbacks: {
                            title: function (tooltipItems: any, data: any) {
                                return data.labels[tooltipItems[0].index];
                            },
                            label: function (tooltipItems: any, data: any) {
                                const dataset = data.datasets[tooltipItems.datasetIndex];
                                const label = dataset.label || '';
                                const value = dataset.data[tooltipItems.index];
                                return `${label}: ${value}`;
                            }
                        }
                    }
                },

            });
            runOnce = true
        }
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

