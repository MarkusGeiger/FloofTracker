import { Card, Space } from "antd";
import dayjs from "dayjs";
import { FoodStatisticsChart } from "./FoodStatisticsChart";
import { useEffect, useState } from "react";
import { WeightChart } from "./WeightChart";


export const StatisticsCharts = ({pets}) => {
    const [petFoodList, setPetFoodList] = useState([]);
    useEffect(() =>
    {
        setPetFoodList([]);
        pets.forEach((pet, index) => {
            console.log(pet, index);
            fetch("api/Food/daily?petId=" + pet.id).then(response => 
                {
                    if(response.ok)
                    {
                        return response.json();
                    }
                }).then(result => {
                    setPetFoodList(p => [...p, {id: pet.name, data: result.map(groupedFood => {
                        return {x: dayjs(groupedFood.date).format("YYYY-MM-DD"), y: groupedFood.sum};
                    })}]);
                }); 
            });
    }, [pets]);

    console.log("Pet Food List Daily: ", petFoodList);
    return (
        <Space direction="vertical" style={{width: "100%"}}>
            <Card size="small" title="Fütterungen">
                <div style={{height: "300px"}}>
                    <FoodStatisticsChart data={petFoodList}/>
                </div>
            </Card>
            <Card size="small" title="Gewicht">
                <div style={{ height:"300px"}}>
                    <WeightChart data={pets.map(pet => {
                        return {id: pet.name, data: [{x: dayjs().format("YYYY-MM-DD"), y: pet.weight}]};
                    })}/>
                </div>
            </Card>
        </Space>
    );
};