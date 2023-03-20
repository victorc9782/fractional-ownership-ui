import Link from "next/link";
import { useState } from "react";
import { Dropdown } from "@nextui-org/react";

const Layout = ({ children }) => {

  return (
    <div>
        <Dropdown>
            <Dropdown.Button flat>Menu</Dropdown.Button>
            <Dropdown.Menu>
                <Dropdown.Item key="dashboard">
                    <Link
                        href="/dashboard"
                    >
                        Dashboard
                    </Link>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        {children}
    </div>
  );
};

export default Layout;