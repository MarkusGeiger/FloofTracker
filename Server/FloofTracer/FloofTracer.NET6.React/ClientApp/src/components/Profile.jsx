import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Avatar from "antd/lib/avatar/avatar";
import { Card } from "antd";
import Meta from "antd/lib/card/Meta";
import { UserOutlined } from "@ant-design/icons";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <Card title={<span ><UserOutlined style={{marginRight: "15px"}}/>Benutzer</span>}>
           <Meta
            avatar={<Avatar size='large' src={user.picture} alt={user.name} />}
            title={user.nickname}
            description={(
                <>
                    <p>Name: {user.name}</p>
                    <p>Mail: {user.email}</p>
                </>
            )}/>
      </Card>
    )
  );
};

export default Profile;