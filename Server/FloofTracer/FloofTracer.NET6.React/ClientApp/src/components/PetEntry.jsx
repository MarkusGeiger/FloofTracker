import { Divider, InputNumber, Radio, Row } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { useState } from "react";

export const PetEntry = ({name}) => {
    const [value] = useState(40);
    const [preset] = useState(2);
    const [isLickyMat] = useState(false);

    const presetOptions = [
        { label: "Custom", value: 0 },
        { label: "1 EL", value: 1, presetFoodValue: 15 },
        { label: "Klein", value: 2, presetFoodValue: 40 },
        { label: "Groß", value: 3, presetFoodValue: 75 }
      ];

    const handleRadioChange = event => {
      console.log(event);
    };

    const handleAmountChange = amount => {
      console.log(amount);
    };

    const handleLickyMatChange = event => {
      console.log(event);
    };

    return(
        <>
            <Row gutter={[16,  24]} style={{marginBottom: "16px"}}>
                <Divider >{name}</Divider>
                <InputNumber addonAfter="g" value={value} defaultValue={value} min={1} max={400} onChange={handleAmountChange} style={{width: "100%"}}/>
            </Row>
            <Row gutter={[16,  24]} style={{marginBottom: "16px"}}>

                <Radio.Group
                    options={presetOptions}
                    onChange={handleRadioChange}
                    value={preset}
                    optionType="button"
                />
            </Row>
            <Row>
              <Checkbox checked={isLickyMat} onChange={(e) => handleLickyMatChange(e)}>
                LickyMat
              </Checkbox>
            </Row>
        </>
        );
}