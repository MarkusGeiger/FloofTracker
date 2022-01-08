import React, { Component } from "react";
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from "reactstrap";
import moment from "moment-timezone";
//import tz from "moment-timezone";

export class FoodList extends Component {
  static displayName = FoodList.name;

  constructor(props) {
    super(props);
    this.state = { currentDay: props.date, foodList: [] };
  }

  componentDidMount() {
    this.fetchRequest();
  }

  async fetchRequest() {
    console.log("fetch data for food list component");
    fetch(
      `api/Food?date=${this.state.currentDay.toISOString()}&petId=${this.props.petId}`,
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    .then(res => res.json())
    .then(response => {
      //console.log("FoodList response: ", response);
      this.setState({ foodList: response });
    })
    .catch(error => console.log(error));
  }

  render() {
    const currentWeight = this.state.foodList.reduce((pv, cv) => ({ value: pv.value + cv.value }), ({ value: 0 }));
    console.log("render ", this.state.foodList, "currentWeight", currentWeight);
    return (
      <Card>
        <CardBody>
          <CardTitle tag="h5">{this.props.petName}</CardTitle>
          <ListGroup>
            {this.state.foodList.map((c, index) => (
              <ListGroupItem key={index}>
                <strong>{moment.utc(c.timestamp).tz("Europe/Berlin").format("HH:mm")}</strong> {c.value}{c.unit}
              </ListGroupItem>
            ))}
          </ListGroup>
          <div className="p-3 bg-primary my-2 rounded text-light">
            {currentWeight.value}g / ~225g
          </div>
        </CardBody>
      </Card>
    );
  }
}

//export function FoodList({ date, petId, petName, fetchRequest }) {
//  const [currentDay, setCurrentDay] = useState(date);
//  const [foodList, setFoodList] = useState([]);
//
//  fetchRequest = useCallback(() => {
//    fetch(
//      `api/Food?date=${currentDay.toISOString()}&petId=${petId}`,
//      {
//        method: "GET",
//        headers: {
//          'Accept': 'application/json',
//          'Content-Type': 'application/json'
//        }
//      }
//    )
//    .then(res => res.json())
//    .then(response => {
//      //console.log("FoodList response: ", response);
//      setFoodList(response);
//    })
//    .catch(error => console.log(error));
//  }, [currentDay, petId]);
//
//  useEffect(() => fetchRequest());
//
//  return (
//    <Card>
//      <CardBody>
//        <CardTitle tag="h5">{petName}</CardTitle>
//        <ListGroup>
//          {foodList.map((c, index) => (
//            <ListGroupItem key={index}>
//              <strong>{moment.utc(c.timestamp).tz("Europe/Berlin").format("HH:mm")}</strong> {c.value}{c.unit}
//            </ListGroupItem>
//          ))}
//        </ListGroup>
//        <div className="p-3 bg-primary my-2 rounded text-light">
//          {foodList.reduce((pv, cv) => pv.value + cv.value, 0)}g / ~225g
//        </div>
//      </CardBody>
//    </Card>
//  );
//}