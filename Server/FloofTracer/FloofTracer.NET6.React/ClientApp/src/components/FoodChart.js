import { Card } from "antd";
import dayjs from "dayjs";
import { HorizontalGridLines, LineSeries, VerticalGridLines, XAxis, XYPlot, YAxis } from "react-vis";
import '../../node_modules/react-vis/dist/style.css';

export const FoodChart = () => {

    const data = [
        {x: dayjs().subtract(0, 'day'), y: 238},
        {x: dayjs().subtract(1, 'day'), y: 235},
        {x: dayjs().subtract(2, 'day'), y: 234},
        {x: dayjs().subtract(3, 'day'), y: 239},
        {x: dayjs().subtract(4, 'day'), y: 231},
        {x: dayjs().subtract(5, 'day'), y: 237},
        {x: dayjs().subtract(6, 'day'), y: 236},
        {x: dayjs().subtract(7, 'day'), y: 233},
        {x: dayjs().subtract(8, 'day'), y: 232},
        {x: dayjs().subtract(9, 'day'), y: 230}
      ];
    const data2 = [
        {x: dayjs().subtract(0, 'day'), y: 273},
        {x: dayjs().subtract(1, 'day'), y: 253},
        {x: dayjs().subtract(2, 'day'), y: 243},
        {x: dayjs().subtract(3, 'day'), y: 293},
        {x: dayjs().subtract(4, 'day'), y: 213},
        {x: dayjs().subtract(5, 'day'), y: 273},
        {x: dayjs().subtract(6, 'day'), y: 263},
        {x: dayjs().subtract(7, 'day'), y: 233},
        {x: dayjs().subtract(8, 'day'), y: 223},
        {x: dayjs().subtract(9, 'day'), y: 203}
      ];

    return (
        <Card title="Fütterungen">
            <XYPlot height={300} width= {300}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis tickFormat={function tickFormat(d){return new Date(d).toLocaleDateString()}}/>
                <YAxis />
                <LineSeries data={data} />
                <LineSeries data={data2} />
            </XYPlot>
        </Card>
    );
};