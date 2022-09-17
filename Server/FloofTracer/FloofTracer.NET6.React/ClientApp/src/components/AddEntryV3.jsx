import React, { Component } from 'react';
import {
  Button,
  Row,
  Col,
  Input,
  Statistic,
  Popconfirm,
  Modal,
} from 'antd';
import dayjs from 'dayjs';
import { ClockCircleOutlined } from '@ant-design/icons';
import { PetEntryV2, presetOptions } from './PetEntryV2';
import { FoodSetting } from './FoodSetting';

export class AddEntryV3 extends Component {
  static displayName = AddEntryV3.name;

  constructor(props) {
    super(props);
    this.state = { 
      pets: [], 
      submitDisabled: false,
      isTimeModalVisible: false,
      isFoodModalVisible: false,
      time: dayjs(), 
      loading: false, 
      currentTime: dayjs()};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handlePetChange = this.handlePetChange.bind(this);
    this.handleTimeCancel = this.handleTimeCancel.bind(this);
    this.showTimeModal = this.showTimeModal.bind(this);
    this.handleFoodCancel = this.handleFoodCancel.bind(this);
    this.showFoodModal = this.showFoodModal.bind(this);
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
    this.setState({pets: sourcePets, submitDisabled: (value === 0 || value === "")});
  }

  showTimeModal(){
    this.setState({isTimeModalVisible: true});
  };

  handleTimeCancel(){
    this.setState({isTimeModalVisible: false});
  };

  showFoodModal(){
    this.setState({isFoodModalVisible: true});
  }

  handleFoodCancel(){
    this.setState({isFoodModalVisible: false});
  }


  render() {
    return (
      <>
        {/* <Row>
          <Input type="time"
                  value={this.state.time.format("HH:mm")}
                  onChange={(e) => this.handleTimeChange(e)}
                  prefix={<ClockCircleOutlined />}
                  addonAfter={<Button onClick={() => this.setState({ time: dayjs() })}>Jetzt</Button>} />
        </Row> */}
        <Row gutter={24} style={{marginBottom: "16px"}}>
          <Col span={4}>
              <div style={{background: "darkcyan", height: "100%", cursor: "pointer"}} 
                   onClick={this.showTimeModal}>
                <Statistic title="Uhrzeit" 
                           value={this.state.time.format("HH:mm")}/>
              </div>
              <Modal title="Uhrzeit anpassen" 
                     visible={this.state.isTimeModalVisible}
                     onCancel={this.handleTimeCancel}
                     footer={[]}>
                <Input type="time"
                  value={this.state.time.format("HH:mm")}
                  onChange={(e) => this.handleTimeChange(e)}
                  prefix={<ClockCircleOutlined />}
                  addonAfter={<Button onClick={() => this.setState({ time: dayjs() })}>Jetzt</Button>} />
              </Modal>
          </Col>
          {this.state.pets.map(pet => 
            <Col key={pet.id} span={10}>
              <div style={{background: "darkcyan", height: "100%", cursor: "pointer"}} 
                    onClick={this.showFoodModal}>
                <Statistic title={pet.name} 
                            value={pet.food}/>
              
              </div> 
            </Col>
          )}
          <Col span={4}/>
          <Col span={20}>
            <FoodSetting preset={presetOptions}/>
          </Col>
          <Modal title="Fütterung anpassen" 
                 visible={this.state.isFoodModalVisible}
                 onCancel={this.handleFoodCancel}
                 footer={[]}>
            <Row gutter={24} style={{marginBottom: "16px"}}>
              {this.state.pets.map(pet => 
                <Col key={pet.id} span={10}>
                  <PetEntryV2 name={pet.name} onChange={this.handlePetChange}/>
                </Col>
              )}
            </Row>
          </Modal>
        </Row>
        <Row gutter={[16, 24]}>
          <Button type="primary"
                  htmlType="submit"
                  loading={this.state.loading}
                  onClick={this.handleSubmit}
                  disabled={this.state.submitDisabled || this.state.loading}
                  style={{width: "100%"}}>
            Hinzufügen
          </Button>
        </Row>
      </>
      );
  }
}