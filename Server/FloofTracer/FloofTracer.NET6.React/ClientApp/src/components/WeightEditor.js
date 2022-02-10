import { Card, Col, Row } from "antd";

export const WeightEditor = (props) => {

    console.log(props);
    return(
        <Card size="small" title="Gewicht">
           
              {props.pets.map((pet, index) => (
                   <Row key={index}><Col flex={1}>{pet.name}</Col><Col flex={1}>{pet.weight}g</Col></Row>
              ))}
        </Card>
    );
}