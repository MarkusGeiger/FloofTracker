import { Checkbox, Col, Radio, Row } from "antd"
import { useState } from "react";


export const FoodSetting = props => {
    const [preset, setPreset] = useState(0);
    const [isLickyMat] = useState(false);

    const handleRadioChange = event => {

    };

    const handleLickyMatChange = event => {

    };

    return (<>
    <Row style={{padding: "8px 0"}}>
        <Col span={12}>
            <Radio.Group options={props.preset}
                        onChange={handleRadioChange}
                        value={preset}
                        optionType="button"
                        style={{margin: "0 auto"}}/>
        </Col>
        <Col span={12}>
            <Checkbox checked={isLickyMat} 
                    onChange={(e) => handleLickyMatChange(e)}
                    style={{margin: "0 auto"}}>
            LickyMat
            </Checkbox>
        </Col>
    </Row>
    </>);
}