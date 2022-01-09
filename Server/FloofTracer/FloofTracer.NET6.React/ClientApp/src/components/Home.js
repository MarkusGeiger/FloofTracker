import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';

import { AddEntry } from './AddEntry';
import { FoodList } from './FoodList';

import "antd/dist/antd.css";

export class Home extends Component {
  static displayName = Home.name;

  constructor(props) {
    super(props);
    this.state = { pets: [], date: new Date() };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.updateFoodList = this.updateFoodList.bind(this);
  }

  handleUpdate() {
    this.fetchConfiguration()
    this.updateFoodList()
  }

  updateFoodList() {
    console.log("update food list from home");
  }

  componentDidMount() {
    this.fetchConfiguration()
  }

  async fetchConfiguration() {
    console.log("fetch pet list for home component.");
    const response = await fetch('api/Pets');
    if (response.status !== 200) {
      console.log(response);
      this.setState({ pets: [] });
      return;
    }
    const data = await response.json();
    var petList = data.map(pet => ({ name: pet.name, id: pet.id, selected: false }));
    console.log("Pet list: ", petList);
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

  render () {
    return (
      <div>
        <Card size="small" title="F&uuml;tterung">
            <AddEntry dataSubmitted={()=>this.handleUpdate()} />
        </Card>
        <Card size="small" title={this.isToday(this.state.date) ? " Heute" : (this.isYesterday(this.state.date) ? "Gestern" : 'Moment.Utc(this.state.date).format("DD.MM.YYYY")')}>
          <Row>
            {this.state.pets.map((pet, index) => (
              <Col key={index}>
                <FoodList date={this.state.date} petId={pet.id} petName={pet.name} fetchRequest={this.updateFoodList} />
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    );
  }
}
