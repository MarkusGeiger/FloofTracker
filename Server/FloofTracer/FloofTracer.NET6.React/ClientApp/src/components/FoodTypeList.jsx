import { ContainerOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "./Loading";

const FoodTypeList = () => {
    const [ statusCode, setStatusCode ] = useState(0);
    const [ statusMessage, setStatusMessage ] = useState("");
    const [ foodTypes, setFoodTypes ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const requestData = useCallback(()=>{
        fetch("api/FoodType")
        .then(response => {
            console.log("FoodType List Response: ", response);
            setLoading(false);
            setStatusCode(response.status);
            setStatusMessage(response.statusText);
            if (response.ok) {
                return response.json();
            }
        })
        .then(result => {
            if(result) setFoodTypes(result);
        });
    },[])

    useEffect(() => {
        requestData();
    },[requestData]);

    return (
        <Card size="small" title={<span><ContainerOutlined style={{ marginRight: "5px" }} />Dosenübersicht</span>}>
            {loading ?? <Loading />}<br/>
            StatusCode: {statusCode}  {statusMessage}<br/>
            FoodTypes[{foodTypes === undefined || foodTypes.length === 0 ? "undefined" : foodTypes.length}]: {foodTypes ?? foodTypes.map((foodType, index) => {
                return <p>{index}. {JSON.stringify(foodType)}</p>
            })}
        </Card>
    );
}

export default FoodTypeList;