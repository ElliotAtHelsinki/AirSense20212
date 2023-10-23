import React from 'react';
import { Menu } from 'antd';
import { useRouter } from 'next/router';

function MenuBar({ menuList, mode, className, ...props }) {
    const router = useRouter();
    return (
        <Menu
            mode={mode}
            className={className}
            selectedKeys={[router.pathname]}
            defaultOpenKeys={[router.pathname]}
        >
            {menuList
                .filter((menu) => !menu.isHide)
                .map((menu) => {
                    if (menu.children && menu.children.length >= 0) {
                        return (
                            <Menu.SubMenu
                                title={menu.title}
                                key={menu.id}
                                icon={menu.icon}
                            >
                                {menu.children
                                    .filter((subMenu) => !subMenu.isHide)
                                    .map((subMenu) => (
                                        <Menu.Item
                                            onClick={() =>
                                                router.push(
                                                    subMenu.url || '/admin'
                                                )
                                            }
                                            key={subMenu.id}
                                        >
                                            {subMenu.title}
                                        </Menu.Item>
                                    ))}
                            </Menu.SubMenu>
                        );
                    } else {
                        return (
                            <Menu.Item
                                key={menu.id}
                                icon={menu.icon}
                                onClick={() =>
                                    router.push(menu.url || '/admin')
                                }
                            >
                                {menu.title}
                            </Menu.Item>
                        );
                    }
                })}
        </Menu>
    );
}

export default MenuBar;
