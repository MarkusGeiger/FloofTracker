import React, { Component } from 'react';
import {
  Form,
  InputNumber,
  Button,
  Checkbox,
  Row,
  Col,
  TimePicker,
} from 'antd';
import dayjs from 'dayjs';

export class AddEntry extends Component {
  static displayName = AddEntry.name;

  constructor(props) {
    super(props);
    this.state = { value: 40, pets: [], submitDisabled: false, time: dayjs() };

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleCatChange = this.handleCatChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
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
    const bodyContent = JSON.stringify({ timestamp: this.state.time.utc().toISOString(), value: this.state.value, petId: assignedPet.id, unit: 'g' });
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
    this.setState({ value: amount, submitDisabled: false });
  }

  handleCatChange(event, name) {

    let sourcePets = this.state.pets;
    sourcePets.find(pet => pet.name === name).selected = event.target.checked;

    this.setState({ pets: sourcePets, submitDisabled: !sourcePets.some(pet => pet.selected) });
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

  handleTimeChange(time) {
    console.log("time changed: ", time);
    this.setState({ time: time });
  }

  render() {
    return (
      <Row type="flex" justify="center" >
        <Col>
          <Form onFinish={this.handleSubmit}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
            size="small">
            <Form.Item label="Uhrzeit">
              <TimePicker value={this.state.time} onChange={this.handleTimeChange}/>
            </Form.Item>
            <Form.Item label="Menge">
              <InputNumber addonAfter="g" defaultValue={this.state.value} min={1} max={400} onChange={this.handleAmountChange} />
            </Form.Item>
            <Form.Item name="checkbox-group" label="Katzi">
                <Row>
                  {this.state.pets.map((pet, index) => (
                    <Col key={index}>
                      <Checkbox checked={pet.selected} onChange={(e) => this.handleCatChange(e, pet.name)}>
                        {pet.name}
                      </Checkbox>
                    </Col>))}
                </Row>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" disabled={this.state.submitDisabled}>
                Hinzufügen
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      );
  }
}