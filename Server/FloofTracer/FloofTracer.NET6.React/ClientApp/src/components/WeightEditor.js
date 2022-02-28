import { ClockCircleOutlined, DashboardOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Col, Input, Modal, Row, Select, Space } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

var utc = require('dayjs/plugin/utc')
dayjs.extend(utc);

const { Option } = Select;

export const WeightEditor = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState(dayjs().add(12, 'hours'));
    const [currentWeight, setCurrentWeight] = useState(3000);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);
    const [selectedPet, setSelectedPet] = useState(props.pets[0].id);

    const editClicked = event => {
        setModalVisible(true);
    };
    const handleTimeChange = event => {
        console.log("Weight editor date changed: ", event);
        setCurrentTime(dayjs())
    }
    const weightChanged = event =>{
        console.log("Weight editor weight changed: ", event);
        setCurrentWeight(event.target.value);
    }
    const okPressed = event => {
        setIsConfirmLoading(true);
        console.log("Weight entry confirmed:", event);
        const bodyContent = JSON.stringify({ timestamp: currentTime.utc().toISOString(), value: currentWeight, petId: selectedPet, unit: 'g' });
        console.log("Requesting body: ", bodyContent);
        fetch('api/Weight', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: bodyContent
        })
        .then(response => {
            if(response.ok){
                return response.json();
            }
            console.error("Failed to post new weight: ", response);
        })
        .then(result => {
            console.log(result)
        })
        .catch(reason => console.error("Unknown error posting weight:", reason))
        .finally(()=>{
            setModalVisible(false);
            setIsConfirmLoading(false);
        })

    };
    
    return(
        <>
            <Card size="small" 
                title={<span><DashboardOutlined style={{marginRight: "5px"}}/>Gewicht</span>}
                actions={[<PlusOutlined key="edit" onClick={editClicked} />]}>
                {props.pets.map((pet, index) => (
                        <Row key={index}>
                            <Col flex={1}>{pet.name}</Col>
                            <Col flex={1}>{pet.weight}g</Col>
                        </Row>
                ))}
            </Card>
            <Modal title="Gewicht eintragen"
                   centered
                   visible={modalVisible}
                   onOk={okPressed}
                   okText="Übernehmen"
                   confirmLoading={isConfirmLoading}
                   onCancel={() => setModalVisible(false)}
                   cancelText="Abbrechen">
                <Space direction="vertical" style={{width: "100%"}}>
                    <Input type="date"
                        value={currentTime.format("YYYY-MM-DD")}
                        onChange={handleTimeChange}
                        prefix={<ClockCircleOutlined />}/>
                    <Input.Group compact>
                        <Select placeholder="Tier auswählen"
                                value={selectedPet}
                                defaultValue={props.pets[0].id}
                                onChange={value => setSelectedPet(value)}>
                            {props.pets.map(pet => (<Option key={pet.id} value={pet.id}>{pet.name}</Option>))}
                        </Select>
                        <Input style={{ width: '50%' }} type="number"
                               value={currentWeight}
                               addonAfter={<span style={{padding: "0 11px"}}>g</span>}
                               onChange={weightChanged}/>
                    </Input.Group>
                    
                </Space>
            </Modal>
        </>
    );
}