import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, Input, Label } from 'reactstrap';

export class AddEntry extends Component {
  static displayName = AddEntry.name;

  constructor(props) {
    super(props);
    this.state = { value: 0, pets: [], submitDisabled: true };

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
    var petList = data.map(pet => ({ name: pet.name, id: pet.id, selected: false }));
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

  handleAmountChange(event) {
    let value = event.target.value;
    var regex = /^[0-9]+$/;
    if (value === '') {
      this.setState({ submitDisabled: true, value: 0 });
      return;
    }
    if (!value.match(regex)) {
      //alert("Must input numbers");
      return;
    }
    this.setState({ value: event.target.value, submitDisabled: false });
  }
  handleCatChange(event, name) {
    let sourcePets = this.state.pets;
    sourcePets.find(pet => pet.name === name).selected = event.target.checked;
    this.setState({ pets: sourcePets });
  }

  handleSubmit(event) {
    console.log('New submission. Amount: ', this.state.value, ', Pets: ', this.state.pets);
    event.preventDefault();
    const selectedPets = this.state.pets.filter(pet => pet.selected);
    console.log("SelectedPets: ", selectedPets);
    for (let selectedPet in selectedPets) {
      console.log("Posting food to selected pet: ", selectedPet);
      this.postFood(selectedPets[selectedPet]);
    }
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup row>
          <Label for="amountEntry" sm={2}>Menge</Label>
          <Col sm={10}>
            <Input id="amountEntry"
                   name="amount"
                   placeholder="in g"
                   type="text"
                   value={this.state.value} onChange={this.handleAmountChange}/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="checkbox2" sm={2}>Katzi</Label>
          <Col sm={{ size: 10 }}>
            {this.state.pets.map(pet => (
            <FormGroup check inline>
              <Input type="checkbox" checked={pet.selected} onChange={(e) => this.handleCatChange(e, pet.name)} />
                <Label check>{pet.name}</Label>
            </FormGroup>))}
          </Col>
        </FormGroup>
        <FormGroup check row>
          <Col sm={{ offset: 2, size: 10 }}>
            <Button disabled={this.state.submitDisabled}>Hinzufügen</Button>
          </Col>
        </FormGroup>
      </Form>
      );
  }
}