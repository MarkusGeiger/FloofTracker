import React, { Component } from "react";
import { Alert, Badge, Button, Col, List, Popconfirm, Row } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
var isToday = require('dayjs/plugin/isToday')

dayjs.extend(isToday)
dayjs.extend(utc)
dayjs.extend(timezone)

export class FoodList extends Component {
  static displayName = FoodList.name;

  constructor(props) {
    super(props);
    this.state = { loading: true, currentDay: props.date, foodList: [] };
    this.fetchFoodListRequest = this.fetchFoodListRequest.bind(this);
  }

  componentDidMount() {
    console.log("FoodList initial mount.", this.state);
    this.fetchFoodListRequest();
  }

  async fetchFoodListRequest() {
    const newDate = this.state.currentDay;
    console.log("fetch data for food list component", newDate.toISOString());
    return fetch(
      `api/Food?date=${newDate.toISOString()}&petId=${this.props.pet.id}`,
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
      .catch(error => console.log(error))
      .finally(() => {
        this.setState({ loading: false });
      })
  }

  componentDidUpdate(prevProps) {
    if (this.props.requestCounter !== prevProps.requestCounter) {
      this.setState({ loading: true }, () => { this.fetchFoodListRequest() });
    }

    if (this.props.date !== prevProps.date) {
      this.setState({ loading: true, currentDay: this.props.date }, () => { this.fetchFoodListRequest() });
    }
  }

  modalDeleteConfirmedMethod(feedingData) {
    console.log("DeleteButton OK Clicked: ", this, feedingData);
    return fetch('api/Food/' + feedingData.id, { method: "DELETE" }).then(() => this.fetchFoodListRequest());
  }

  render() {
    const currentSum = this.state.foodList.reduce((pv, cv) => ({ value: pv.value + cv.value }), ({ value: 0 }));
    const targetWeight = this.props.pet.weight * 0.05;
    let alertType = "info";
    if (Math.abs(currentSum.value - targetWeight) < 10) {
      // target weight nearly reached
      alertType = "success";
    }
    else if (currentSum.value < targetWeight) {
      alertType = "warning";
    }
    else if (currentSum.value > targetWeight) {
      alertType = "error";
    }
    
    return (
      <Spin spinning={this.state.loading} indicator={antIcon}>
        <List size="small"
          header={<h4>{this.props.pet.name}</h4>}
          bordered
          dataSource={this.state.foodList.sort((a, b) => (dayjs(a.timestamp).isAfter(dayjs(b.timestamp)) ? 1 : -1))}
          renderItem={(item) => (
            <List.Item>
              <Row style={{width: "100%"}} justify="space-between" align="middle">
                <Col span={6}><strong>{dayjs.utc(item.timestamp).tz("Europe/Berlin").format("HH:mm")}</strong></Col>
                <Col span={4}>{item.value}{item.unit}</Col>
                <Col span={5}>{item.lickyMat ? <Badge count={"LM"}/> : ""}</Col>
                
                {dayjs(item.timestamp).isToday() ? (
                  <Col span={4}>
                    <Popconfirm title={"Fütterung für " + this.props.pet.name + " um " + dayjs.utc(item.timestamp).tz("Europe/Berlin").format("HH:mm") + " mit " + item.value + item.unit + " löschen?"}
                                onConfirm={() => this.modalDeleteConfirmedMethod(item)}
                                okText="Ja"
                                cancelText="Nein"
                              >
                      <Button size="small" shape="circle" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                  </Col>) : ""}
               
              </Row>
            </List.Item>)} />
        <Alert
          type={alertType}
          message={currentSum.value + "g / ~" + targetWeight + "g" + (targetWeight > currentSum.value ? " (" + (targetWeight - currentSum.value) + "g übrig)" : "")}
          style={{ marginTop: "8px" }} />
      </Spin>
    );
  }
}