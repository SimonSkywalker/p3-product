import { useEffect } from "react"
import { Chart } from "chart.js";

interface ChartProps {
  questionName: string
  questionIndex: number
  questions: any[]
  answerCount: {}
}

export default function BarChart({ questionName, questionIndex, questions, answerCount } : ChartProps) {
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

  for ( let i in questions) {
      randomBackgroundColor.push(dynamicColors());
  }
  const datasetMaker = (object: any): any[]=>{

    let tempArray = [];

    for (const [key, value] of Object.entries(object)) {
      tempArray.push({
        data: Object.values(value as {}),
        label: key,
        backgroundColor: dynamicColors(),
        borderWidth: 2
      })
    }
    return tempArray;
  }
  useEffect(() => {
      const canvas = document.getElementById(`myChart${questionIndex}`) as HTMLCanvasElement;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: questions,
                datasets: datasetMaker(answerCount)
            },
            options: {
                scales: {
                    xAxes: [{
                      ticks: {
                        precision: 0
                      },
                      stacked: true
                    }],
                    yAxes: [{
                      ticks: {
                        precision: 0
                      },
                      stacked: true
                    }],
                } 
            },
        });
    }, [])


    return (
        <>
            {/* Stacked chart */}
            <h1 className="mx-auto mt-10 text-xl font-semibold capitalize ">{questionName}</h1>
            <div className="w-[1100px] h-fit flex mx-auto my-auto">
                <div className='border border-gray-400 pt-0 rounded-xl  w-full h-fit my-auto  shadow-xl pb-2'>
                <canvas id={`myChart${questionIndex}`}></canvas>
                </div>
            </div>
        </>
    )
}