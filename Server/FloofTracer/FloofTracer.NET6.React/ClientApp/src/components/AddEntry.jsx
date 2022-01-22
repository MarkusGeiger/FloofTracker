import React, { Component } from 'react';
import {
  Form,
  InputNumber,
  Button,
  Checkbox,
  Row,
  Col,
  TimePicker,
  Radio,
} from 'antd';
import dayjs from 'dayjs';

export class AddEntry extends Component {
  static displayName = AddEntry.name;
  static presetOptions = [
    { label: "Custom", value: 0 },
    { label: "1 EL", value: 1, presetFoodValue: 15 },
    { label: "Klein", value: 2, presetFoodValue: 40 },
    { label: "Groß", value: 3, presetFoodValue: 75 }
  ]

  constructor(props) {
    super(props);
    this.state = { value: 40, pets: [], submitDisabled: false, time: dayjs(), loading: false, preset: 2 };

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleCatChange = this.handleCatChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
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
    this.setState({ value: amount, submitDisabled: false, preset: 0 });
  }

  handleCatChange(event, name) {

    let sourcePets = this.state.pets;
    sourcePets.find(pet => pet.name === name).selected = event.target.checked;

    this.setState({ pets: sourcePets, submitDisabled: !sourcePets.some(pet => pet.selected) });
  }

  async handleSubmit(event) {
    console.log('New submission. Amount: ', this.state.value, ', Pets: ', this.state.pets);
    this.setState({ loading: true });
    //event.preventDefault();
    const selectedPets = this.state.pets.filter(pet => pet.selected);
    console.log("SelectedPets: ", selectedPets);
    for (let selectedPet in selectedPets) {
      console.log("Posting food to selected pet: ", selectedPet);
      await this.postFood(selectedPets[selectedPet]);
    }
    console.log("Data submission done...calling parent");
    this.setState({ loading: false });
    this.props.dataSubmitted();
  }

  handleTimeChange(time) {
    console.log("time changed: ", time);
    this.setState({ time: time });
  }

  handleRadioChange(event) {
    console.log("Radio changed: ", event, "target value: ", event.target.value, "state: ", this.state);
    if (event.target.value != null) {
      console.log("DEBUG searchvalue", event.target.value, "preset: ", AddEntry.presetOptions);
      const foundEntry = AddEntry.presetOptions.find(option => option.value === event.target.value);
      if (foundEntry) {
        let presetValue = this.state.value;
        console.log("DEBUG", foundEntry);
        if (foundEntry.presetFoodValue) {
          presetValue = foundEntry.presetFoodValue;
        }
        this.setState({ preset: event.target.value, value: presetValue });
      }
    }
  }

  render() {
    return (
      <div style={{ width: "60%", margin: "0 auto" }} id="entrydiv">
        <Form onFinish={this.handleSubmit}
              labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          id="entryform"
          size="small">
          <Form.Item label="Uhrzeit">
            <TimePicker value={this.state.time} onChange={this.handleTimeChange} /><Button style={{ marginLeft: "5px" }} onClick={() => this.setState({time:dayjs()})}>Jetzt</Button>
          </Form.Item>
          <Form.Item label="Menge">
            <InputNumber addonAfter="g" value={this.state.value} defaultValue={this.state.value} min={1} max={400} onChange={this.handleAmountChange} />
          </Form.Item>
          <Form.Item label="Voreinstellung">
            <Radio.Group
              options={AddEntry.presetOptions}
              onChange={this.handleRadioChange}
              value={this.state.preset}
              optionType="button"
            />
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
            <Button type="primary" htmlType="submit" loading={this.state.loading} disabled={this.state.submitDisabled || this.state.loading}>
              Hinzufügen
            </Button>
          </Form.Item>
        </Form>
      </div>
      );
  }
}