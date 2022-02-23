import { EditOutlined, GiftOutlined } from "@ant-design/icons";
import { Card } from "antd";

export const FoodEditor = () => {

    const editClicked = event => {
        console.log("Edit Food Types Clicked: ", event);
    };

    return (

        <Card size="small"
            title={<span><GiftOutlined style={{ marginRight: "5px" }} />Futter</span>}
            actions={[<EditOutlined key="edit" onClick={editClicked} />]}>
            Mjamjam<br />
            Catz FineFood<br />
            Zooplus<br />
            Animonda<br />
        </Card>
    );
}