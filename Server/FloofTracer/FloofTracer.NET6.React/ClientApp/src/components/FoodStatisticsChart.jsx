import { ResponsiveLine } from "@nivo/line";
import { NivoThemeDark } from "./NivoTheme";

export const FoodStatisticsChart = ({ data /* see data tab */ }) => (
    <ResponsiveLine 
        // {...commonProperties}
        theme={NivoThemeDark}
        colors={{ scheme: 'dark2' }}
        data={data}
        margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
        xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            useUTC: false,
            precision: 'day',
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
            type: 'linear',
            stacked: false,
            min: 'auto',
            max: 'auto',
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Fütterung (g)',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        axisBottom={{
            format: '%b %d',
            tickValues: 'every 7 days',
            legend: '',
            legendOffset: -12,
        }}
        curve='monotoneX'
        enablePointLabel={false}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{
            from: 'serieColor',
            modifiers: [['darker', 0.3]],
        }}
        useMesh={true}
        enableSlices={false}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 50,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'square',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)