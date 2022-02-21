import { Card, Space } from "antd";
import dayjs from "dayjs";
import { FoodStatisticsChart } from "./FoodStatisticsChart";
import { useEffect, useState } from "react";
import { WeightChart } from "./WeightChart";


export const StatisticsCharts = ({pets}) => {
    const [petFoodList, setPetFoodList] = useState([]);
    const [petWeightList, setPetWeightList] = useState([]);
    useEffect(() =>
    {
        setPetFoodList([]);
        pets.forEach((pet, index) => {
            console.log(pet, index);
            fetch("api/Food/daily?petId=" + pet.id)
            .then(response => 
                {
                    if(response.ok)
                    {
                        return response.json();
                    }
                })
            .then(result => {
                    setPetFoodList(p => [...p, {id: pet.name, data: result.map(groupedFood => {
                        return {x: dayjs(groupedFood.date).format("YYYY-MM-DD"), y: groupedFood.sum};
                    })}]);
                });
            });
        
        fetch("api/Weight")
        .then(response => {
            if(response.ok){
                return response.json();
            }
        })
        .then(result => {
            let resultArray = [];
            // Get unique petId entries
            const unique = [...new Set(result.map(item => item.petId))];
            unique.forEach(index => {
                // Filter all weights for the respective petId
                const currentPetWeights = result.filter(entry => entry.petId === index);
                resultArray.push(
                    {
                        id: pets.find(pet => pet.id === index).name, 
                        data: currentPetWeights.map(weightList => {
                            return {
                                x: dayjs(weightList.timestamp).format("YYYY-MM-DD"), 
                                y: weightList.value
                            }
                        })
                    })
            });
            // Add fake "today" measurement to ensure the graph is pretty
            resultArray.forEach((pet) => {
                pet.data.push({x: dayjs().format("YYYY-MM-DD"), y: pet.data[pet.data.length - 1].y});
            });
            setPetWeightList(resultArray);
        });
    }, [pets]);

    console.log("Pet Food List Daily: ", petFoodList);
    console.log("Pet Weight List: ", petWeightList);
    return (
        <Space direction="vertical" style={{width: "100%"}}>
            <Card size="small" title="Fütterungen">
                <div style={{height: "300px"}}>
                    <FoodStatisticsChart data={petFoodList}/>
                </div>
            </Card>
            <Card size="small" title="Gewicht">
                <div style={{ height:"300px"}}>
                    <WeightChart data={petWeightList}/>
                </div>
            </Card>
        </Space>
    );
};