﻿import React, { Component } from 'react';
import {
  Form,
  InputNumber,
  Button,
  Checkbox,
  Row,
  Col,
} from 'antd';

import "antd/dist/antd.css";

export class AddEntry extends Component {
  static displayName = AddEntry.name;

  constructor(props) {
    super(props);
    this.state = { value: 40, pets: [], submitDisabled: false };

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleCatChange = this.handleCatChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchConfiguration()
  }

  async fetchConfiguration() {
    console.log("populate data.");
    const response = await fetch('api/Pets');
    if (response.status !== 200) {
      console.log(response);
      this.setState({ pets: [] });
      return;
    }
    const data = await response.json();
    var petList = data.map(pet => ({ name: pet.name, id: pet.id, selected: true }));
    console.log("Pet list: ", petList);
    this.setState({ pets: petList });
  }

  async postFood(assignedPet) {
    const bodyContent = JSON.stringify({ value: this.state.value, petId: assignedPet.id, unit: 'g' });
    console.log("Requesting body: ", bodyContent);
    const response = await fetch('api/Food', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyContent
    });
    if (response.status !== 201) {
      console.log(response);

      return;
    }
    const data = await response.json();
    console.log("response: ", response, "responseData: ", data);
  }

  handleAmountChange(amount) {
    var regex = /^[0-9]+$/;
    if (amount === '') {
      this.setState({ submitDisabled: true, value: 0 });
      return;
    }
    if (!amount.match(regex)) {
      return;
    }
    this.setState({ value: amount, submitDisabled: false });
  }

  handleCatChange(event, name) {
    let sourcePets = this.state.pets;
    sourcePets.find(pet => pet.name === name).selected = event.target.checked;
    this.setState({ pets: sourcePets });
  }

  async handleSubmit(event) {
    console.log('New submission. Amount: ', this.state.value, ', Pets: ', this.state.pets);
    //event.preventDefault();
    const selectedPets = this.state.pets.filter(pet => pet.selected);
    console.log("SelectedPets: ", selectedPets);
    for (let selectedPet in selectedPets) {
      console.log("Posting food to selected pet: ", selectedPet);
      await this.postFood(selectedPets[selectedPet]);
    }
    console.log("Data submission done...calling parent");
    this.props.dataSubmitted();
  }

  render() {
    return (
      <Form onFinish={this.handleSubmit}>
        <Form.Item label="Menge">
          <InputNumber addonAfter="g" defaultValue="40" value={this.state.value} onChange={(e) => this.handleAmountChange(e.target.value)} />
        </Form.Item>
        <Form.Item name="checkbox-group" label="Katzi">
          <Checkbox.Group>
            <Row>
              {this.state.pets.map((pet, index) => (
                <Col key={index}>
                  <Checkbox value={pet.selected} checked={pet.selected} onChange={(e) => this.handleCatChange(e, pet.name)}>
                    {pet.name}
                  </Checkbox>
                </Col>))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={this.state.submitDisabled}>
            Hinzufügen
          </Button>
        </Form.Item>
      </Form>
      );
  }
}