import React, { Component } from "react";
import { Alert, Button, List, Modal } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import "antd/dist/antd.css";

const { confirm } = Modal;
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
    this.state = { loading: true, currentDay: props.date, foodList: [], deleteModalVisible: false, deleteModalLoading: false };
    this.deleteButtonClick = this.deleteButtonClick.bind(this);
    this.fetchFoodListRequest = this.fetchFoodListRequest.bind(this);
  }

  componentDidMount() {
    console.log("FoodList initial mount.", this.state);
    this.fetchFoodListRequest();
  }

  async fetchFoodListRequest() {
    const newDate = this.state.currentDay;
    console.log("fetch data for food list component");
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

    console.log("current/previous request: ", this.props.requestCounter, prevProps.requestCounter);
    console.log("current/previous date: ", this.props.date, prevProps.date);

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

  deleteButtonClick(feedingData) {
    console.log("Event data to be deleted: ", feedingData)

    confirm({
      title: 'Fütterung löschen?',
      icon: <ExclamationCircleOutlined />,
      visible: this.state.visible,
      content: "Fütterung für " + this.props.pet.name + " um " + dayjs.utc(feedingData.timestamp).tz("Europe/Berlin").format("HH:mm") + " mit " + feedingData.value + feedingData.unit,
      okText: 'Ja',
      okType: 'danger',
      cancelText: 'Nein',
      onOk: () => {
        this.modalDeleteConfirmedMethod(feedingData)
      },
      onCancel() { },
    });
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
    console.log("render foodlist", this.state.foodList, "currentWeight", currentSum, "Alerttype: ", alertType, "IsToday(" + dayjs(this.state.currentDay).format("YYYY-MM-DD") + "): ", dayjs(this.state.currentDay).isToday());
    return (
      <Spin spinning={this.state.loading} indicator={antIcon}>
        <List size="small"
          header={<h4>{this.props.pet.name}</h4>}
          bordered
          dataSource={this.state.foodList.sort((a, b) => (dayjs(a.timestamp).isAfter(dayjs(b.timestamp)) ? 1 : -1))}
          renderItem={(item) => (
            <List.Item actions={dayjs(item.timestamp).isToday() ? [<Button size="small" shape="circle" icon={<DeleteOutlined />} danger onClick={() => this.deleteButtonClick(item)} />] : []}>
              <strong>{dayjs.utc(item.timestamp).tz("Europe/Berlin").format("HH:mm")}</strong> {item.value}{item.unit}
            </List.Item>)} />
        <Alert
          type={alertType}
          message={currentSum.value + "g / ~" + targetWeight + "g" + (targetWeight > currentSum.value ? " (" + (targetWeight - currentSum.value) + "g übrig)" : "")}
          style={{ marginTop: "8px" }} />
      </Spin>
    );
  }
}