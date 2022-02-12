import { Space } from "antd";
import LogoutButton from "./LogoutButton";
import Profile from "./Profile";

const UserManagement = () => {
    return (
        <Space direction="vertical">
            <LogoutButton />
            <Profile />
        </Space>
    );
}

export default UserManagement;