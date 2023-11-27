'use client'
import Example from '../linechart'
import Example2 from '../Pie'

export default function ChartPage(response: any) {
console.log(response);

return(
    <main>
        <div className='overflow-x-auto'>
            <ul className='space-x-5 flex flex-row'>
                <li>
                <Example/>
                </li>
                <li>
                <Example2/>
                </li>
            </ul>
        </div>
    </main>
    )
}