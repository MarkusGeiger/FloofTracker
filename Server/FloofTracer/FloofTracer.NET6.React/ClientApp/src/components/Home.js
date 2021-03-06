import React, { Component } from 'react';
import { Card, Row, Col, Space, Button, Tabs } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined, EditOutlined, LineChartOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import { FoodList } from './FoodList';
import { SizeCheck } from './SizeCheck';
import { WeightEditor } from './WeightEditor';
import { FoodEditor } from './FoodEditor';
import { StatisticsCharts } from './StatisticsCharts';
import UserManagement from './UserManagement';
import FoodTypeList from './FoodTypeList';
import { AddEntryV2 } from './AddEntryV2';

const { TabPane } = Tabs;

var utc = require('dayjs/plugin/utc')
dayjs.extend(utc);

var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(timezone);

var isToday = require('dayjs/plugin/isToday');
dayjs.extend(isToday);

var isYesterday = require('dayjs/plugin/isYesterday');
dayjs.extend(isYesterday);

export class Home extends Component {
  static displayName = Home.name;

  constructor(props) {
    super(props);
    this.state = { pets: [], date: dayjs(), requestCounter: 1 };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.updateFoodList = this.updateFoodList.bind(this);
  }

  handleUpdate() {
    this.fetchConfiguration()
    this.updateFoodList()
  }

  updateFoodList() {
    console.log("update food list from home");
    this.setState({ requestCounter: parseInt(this.state.requestCounter) + 1 });
  }

  componentDidMount() {
    this.fetchConfiguration()
  }

  async fetchConfiguration() {
    let petList = [];
    try {

      console.log("fetch pet list for home component.");

      const petResponse = await fetch('api/Pets');
      const petData = await petResponse.json();

      petList = petData.map(pet => ({ name: pet.name, id: pet.id, selected: false, weight: 0 }));
      console.log("Pet list: ", petList);

      const weightResponse = await fetch('api/Weight');
      const weightData = await weightResponse.json();
      console.log("weight list: ", weightData);

      for (let weightIndex in weightData) {
        const weight = weightData[weightIndex];
        const petArrayItemIndex = petList.findIndex(pet => pet.id === weight.petId);
        console.log("Weight: ", weight, "ArrayIndex for PetId: ", petArrayItemIndex);
        petList[petArrayItemIndex].weight = weight.value;
      }
      console.log("Pet list updated: ", petList);
    }
    catch (e) {
      console.log("Failed fetching data in home: ", e);
    }

    this.setState({ pets: petList });
    this.updateFoodList();
  }

  isToday(someDate) {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
  }

  isYesterday(someDate) {
    const today = new Date() - 86400000;
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
  }

  render() {
    const columnCount = Math.floor(24.0 / this.state.pets.length);
    console.log("Number of pets: ", this.state.pets.length, "Column count: ", columnCount);
    console.log("CurrentDate: ", this.state.date);
    return (
      <div id="homediv">
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span style={{marginLeft: "5px"}}><EditOutlined />Tracker</span>} key="1">
            <Space direction="vertical" style={{ width: "100%" }} id="homespace">
              <Card size="small" title="F&uuml;tterung" id="entrycard">
                <AddEntryV2 dataSubmitted={()=>this.handleUpdate()} />
              </Card>
              <Card id="foodlistcard"
                    size="small"
                    title={this.state.date.isToday() ? " Heute" : (this.state.date.isYesterday() ? "Gestern" : this.state.date.utc().tz("Europe/Berlin").format("DD.MM.YYYY"))}>
                <Row gutter={8}>
                  {this.state.pets.map((pet, index) => (
                    <Col key={index} span={Math.floor(24.0 / this.state.pets.length)}>
                      <FoodList date={this.state.date} requestCounter={this.state.requestCounter} pet={pet} ref={ref => this.foodListRef = ref} />
                  </Col>
                ))}
                </Row>
                <Row justify="space-between">
                  <Col>
                    <Button icon={<DoubleLeftOutlined />} size="small" onClick={
                      () => {
                        const newDate = dayjs(this.state.date).subtract(1, 'day');
                        this.setState({ date: newDate });
                      }
                    } />
                  </Col>
                  {dayjs.utc(this.state.date).tz("Europe/Berlin").isToday() ? "" : (
                    <Col>
                      {<Button icon={<DoubleRightOutlined />} size="small" onClick={
                        () => {
                          const newDate = dayjs(this.state.date).add(1, 'day');
                          this.setState({ date: newDate });
                        }
                      } />}
                    </Col>)
                  }
                </Row>
              </Card>
              <SizeCheck/>
            </Space>
          </TabPane>
          <TabPane tab={<span><SettingOutlined />Einstellungen</span>} key="2">
            <Space direction='vertical' style={{ width: "100%" }} >
              <WeightEditor pets={this.state.pets}/>
              <FoodEditor/>
              <FoodTypeList/>
            </Space>
          </TabPane>
          <TabPane tab={<span style={{marginRight: "5px"}}><LineChartOutlined />Statistiken</span>} key="3">
            <Space direction='vertical' style={{ width: "100%" }}>
              <StatisticsCharts pets={this.state.pets}/>
            </Space>
          </TabPane>
          <TabPane tab={<span style={{marginRight: "5px"}}><UserOutlined />Benutzer</span>} key="4">
            <Space direction='vertical' style={{ width: "100%" }}>
              <UserManagement/>
            </Space>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
