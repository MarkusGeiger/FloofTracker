import React, { Component } from 'react';
import {
  Button,
  Row,
  Col,
  Input,
} from 'antd';
import dayjs from 'dayjs';
import { ClockCircleOutlined } from '@ant-design/icons';
import { PetEntry } from './PetEntry';

export class AddEntryV2 extends Component {
  static displayName = AddEntryV2.name;

  constructor(props) {
    super(props);
    this.state = { pets: [], submitDisabled: false, time: dayjs(), loading: false, currentTime: dayjs()};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handlePetChange = this.handlePetChange.bind(this);
  }

  componentDidMount() {
    this.fetchConfiguration()
    setInterval(() => this.setState({ currentTime: dayjs() }), 30000);
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
    const bodyContent = JSON.stringify({ timestamp: this.state.time.utc().toISOString(), value: assignedPet.food, petId: assignedPet.id, unit: 'g', lickyMat: assignedPet.lickyMat });
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

  async handleSubmit() {
    console.log('New submission. Time: ' + this.state.time + ', Pets: ', this.state.pets);
    this.setState({ loading: true });
    
    const selectedPets = this.state.pets.filter(pet => pet.selected);
    console.log("SelectedPets: ", selectedPets);
    for (let selectedPet in selectedPets) {
      console.log("Posting food to selected pet: ", selectedPet);
      await this.postFood(selectedPets[selectedPet]);
    }
    console.log("Data submission done...calling parent");
    this.setState({ loading: false });
    if(this.props.dataSubmitted) this.props.dataSubmitted();
  }

  handleTimeChange(event) {
    console.log("time changed: ", event.target.value, "Parsed: ", dayjs(dayjs().format("YYYY-MM-DD") + " " + event.target.value, "YYYY-MM-DD HH:mm"));
    this.setState({ time: dayjs(dayjs().format("YYYY-MM-DD") + " " + event.target.value, "YYYY-MM-DD HH:mm") });
  }

  handlePetChange(name, value, lickyMat){
    console.log("PetEntry " + name + " Changed: ", value, lickyMat);

    let sourcePets = this.state.pets;
    sourcePets.find(pet => pet.name === name).food = value;
    sourcePets.find(pet => pet.name === name).lickyMat = lickyMat;
    this.setState({pets: sourcePets});
  }

  render() {
    console.log("Pets: ", this.state.pets)
    return (
      <>
        <Row>
          <Col flex={"auto"}>
            <Input type="time"
                   value={this.state.time.format("HH:mm")}
                   onChange={(e) => this.handleTimeChange(e)}
                   prefix={<ClockCircleOutlined />}
                   addonAfter={<Button onClick={() => this.setState({ time: dayjs() })}>Jetzt</Button>} />
          </Col>
        </Row>
        <Row gutter={24} style={{marginBottom: "16px"}}>
          {this.state.pets.map(pet => 
            <Col span={12}>
              <PetEntry name={pet.name} onChange={this.handlePetChange}/>
            </Col>
          )}
        </Row>
        <Row gutter={[16, 24]}>
          <Col flex={"auto"}>
            <Button type="primary" 
                    htmlType="submit" 
                    loading={this.state.loading} 
                    onClick={this.handleSubmit}
                    disabled={this.state.submitDisabled || this.state.loading} 
                    style={{width: "100%"}}>
              Hinzufügen
            </Button>
          </Col>
        </Row>
      </>
      );
  }
}