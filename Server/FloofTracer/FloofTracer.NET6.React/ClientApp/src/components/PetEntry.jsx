import { Divider, Input, Radio, Row } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { useEffect, useState } from "react";

export const PetEntry = ({name, onChange}) => {
    const [value, setValue] = useState(40);
    const [preset, setPreset] = useState(2);
    const [isLickyMat, setIsLickyMat] = useState(false);

    const presetOptions = [
        // { label: "Custom", value: 0 },
        { label: "1 EL", value: 1, presetFoodValue: 15 },
        { label: "Klein", value: 2, presetFoodValue: 40 },
        { label: "Mittel", value: 3, presetFoodValue: 50 },
        { label: "Groß", value: 4, presetFoodValue: 75 }
      ];

    useEffect(()=>{
      if(onChange) onChange(name, value, isLickyMat);
    }, [name, value, isLickyMat, onChange]);

    const handleRadioChange = event => {
      console.log(event);
      const index = event.target.value;
      const foundEntry = presetOptions.find(option => option.value === event.target.value);
      setPreset(index);
      setValue(foundEntry.presetFoodValue);
    };

    const handleAmountChange = event => {
      let amount = event.target.value;
      console.log("Amount changed: ", amount);
      if(!isNaN(parseFloat(amount)) && !isNaN(amount - 0)) {
        amount = Math.min(400, amount);
        amount = Math.max(0, amount);
      }
      else {
        amount = "";
      }
      const foundEntry = presetOptions.find(option => option.presetFoodValue === amount);
      console.log("AmountChange FoundEntry: ", foundEntry);
      setValue(amount);
      setPreset(foundEntry === undefined ? 0 : foundEntry.value);
    };

    const handleLickyMatChange = event => {
      console.log(event);
      setIsLickyMat(event.target.checked);
    };

    return(
        <>
            <Row style={{padding: "8px 0"}}>
                <Divider >{name}</Divider>
                <Input type="tel"
                       addonAfter={<span className="ant-input-number-group-addo" style={{padding: "0 11px"}}>g</span>}
                       value={value} 
                       defaultValue={value} 
                       min={1} 
                       max={400} 
                       onChange={handleAmountChange}
                       style={{width: "100%"}}/>
            </Row>
            <Row style={{padding: "8px 0"}}>

                <Radio.Group
                    options={presetOptions}
                    onChange={handleRadioChange}
                    value={preset}
                    optionType="button"
                    style={{margin: "0 auto"}}
                />
            </Row>
            <Row style={{padding: "8px 0"}}>
              <Checkbox checked={isLickyMat} 
                        onChange={(e) => handleLickyMatChange(e)}
                        style={{margin: "0 auto"}}>
                LickyMat
              </Checkbox>
            </Row>
        </>
        );
}