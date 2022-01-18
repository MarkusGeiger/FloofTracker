import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Descriptions } from "antd";
import { useState } from "react";

export function SizeCheck(props) {
  const [measurements, setMeasurements] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  function refresh() {
    let measurementList = [];

    const body = document.getElementsByTagName('body');
    if (body != null && body.length > 0) {
      measurementList.push({
        name: "body width",
        value: Math.ceil(body[0].getBoundingClientRect().width) + " px"
      })
    }

    const root = document.getElementById('root');
    if (root != null) {
      measurementList.push({
        name: "root width",
        value: Math.ceil(root.getBoundingClientRect().width) + " px"
      })
    }

    const layoutdiv = document.getElementById('layoutdiv');
    if (layoutdiv != null) {
      measurementList.push({
        name: "layout width",
        value: Math.ceil(layoutdiv.getBoundingClientRect().width) + " px"
      })
    }

    const homediv = document.getElementById('homediv');
    if (homediv != null) {
      measurementList.push({
        name: "home width",
        value: Math.ceil(homediv.getBoundingClientRect().width) + " px"
      })
    }

    const homespace = document.getElementById('homespace');
    if (homespace != null) {
      measurementList.push({
        name: "home space width",
        value: Math.ceil(homespace.getBoundingClientRect().width) + " px"
      })
    }

    const entrycard = document.getElementById('entrycard');
    if (entrycard != null) {
      measurementList.push({
        name: "entry card width",
        value: Math.ceil(entrycard.getBoundingClientRect().width) + " px"
      })
    }

    const foodlistcard = document.getElementById('foodlistcard');
    if (foodlistcard != null) {
      measurementList.push({
        name: "food list width",
        value: Math.ceil(foodlistcard.getBoundingClientRect().width) + " px"
      })
    }

    const sizecheckdiv = document.getElementById('sizecheckdiv');
    if (sizecheckdiv != null) {
      measurementList.push({
        name: "size check width",
        value: Math.ceil(sizecheckdiv.getBoundingClientRect().width) + " px"
      })
    }

    const entryform = document.getElementById('entryform');
    if (entryform != null) {
      measurementList.push({
        name: "entry form width",
        value: Math.ceil(entryform.getBoundingClientRect().width) + " px"
      })
    }

    const entrydiv = document.getElementById('entrydiv');
    if (entrydiv != null) {
      measurementList.push({
        name: "entry div width",
        value: Math.ceil(entrydiv.getBoundingClientRect().width) + " px"
      })
    }

    setMeasurements(measurementList);
  }

  function toggleOpen(){
    setIsOpen(!isOpen);
    refresh();
  }

  return (
    <div>
      <Button onClick={toggleOpen} icon={isOpen ? <UpOutlined /> : <DownOutlined />}>Size Check</Button>
      {isOpen ? (
        <div style={{ padding: "25px 5px 5px 5px", width: "90%", margin: "0 auto" }} id="sizecheckdiv">
          <Button onClick={refresh}>Refresh sizes</Button>

          <Descriptions title="Measurements" bordered>
            {measurements.map(measurement => (<Descriptions.Item label={measurement.name}>{measurement.value}</Descriptions.Item>))}
          </Descriptions>

          <Descriptions title='Browser Info' bordered>
            <Descriptions.Item label='DevicePixelRatio'>{JSON.stringify(window.devicePixelRatio, null, 2)}</Descriptions.Item>
            <Descriptions.Item label='VisualViewport'>{JSON.stringify(window.visualViewport, null, 2)}</Descriptions.Item>
            <Descriptions.Item label='InnerHeight'>{JSON.stringify(window.innerHeight, null, 2)}</Descriptions.Item>
            <Descriptions.Item label='InnerWidth'>{JSON.stringify(window.innerWidth, null, 2)}</Descriptions.Item>
            <Descriptions.Item label='OuterHeight'>{JSON.stringify(window.outerHeight, null, 2)}</Descriptions.Item>
            <Descriptions.Item label='OuterWidth'>{JSON.stringify(window.outerWidth, null, 2)}</Descriptions.Item>
            <Descriptions.Item label='Closed'>{JSON.stringify(window.closed, null, 2)}</Descriptions.Item>
            <Descriptions.Item label='History'>{JSON.stringify(window.history, null, 2)}</Descriptions.Item>
          </Descriptions>
        </div>
      ) : ""}
    </div>
    );
}