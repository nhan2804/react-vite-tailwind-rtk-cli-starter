import { Avatar, Card } from "antd";
import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Meta } = Card;
const CardProject = ({ title, name, description, onEdit, _id, avatar }) => {
  return (
    <div>
      <Card
        hoverable
        cover={
          <div>
            <Link className="block" to={`/projects/${_id}/test`}>
              <img
                className="w-full object-cover h-40"
                alt="example"
                src={`${
                  avatar ||
                  "https://png.pngtree.com/png-vector/20220409/ourmid/pngtree-warehouse-workers-check-quantity-and-delivery-of-products-from-customers-purchase-png-image_4503518.png"
                }`}
              />
            </Link>
          </div>
        }
        actions={[
          // <SettingOutlined key="setting" />,
          <EditOutlined onClick={onEdit} key="edit" />,
          // <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Meta
          // avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
          title={title}
          description={description}
        />
      </Card>
    </div>
  );
};

export default CardProject;
