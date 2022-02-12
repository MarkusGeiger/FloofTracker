import { Button, Space } from "antd";

const LandingPage = () => {
    return (
        <Space>
            <Button href="/app">App</Button>
            <Button href="/user-mgmt">User Management</Button>
        </Space>
    );
}

export default LandingPage;