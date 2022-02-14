import { GiftOutlined } from "@ant-design/icons";
import { Card } from "antd";

export const FoodEditor = () => {
    return (
        
        <Card size="small" title={<span><GiftOutlined style={{marginRight: "5px"}}/>Futter</span>}>
            Mjamjam<br/>
            Catz FineFood<br/>
            Zooplus<br/>
            Animonda<br/>
        </Card>
    );
}