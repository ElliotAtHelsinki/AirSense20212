import { Breadcrumb } from 'antd';
import Link from 'next/link';

export default function UrlBreadcrumb({ breadcrumbs = [] }) {
    function render(item) {
        if (item.url) {
            return (
                <Link className='font-bold' href={item.url}>
                    {item.name}
                </Link>
            );
        }
        return item.name;
    }

    return (
        <>
            <Breadcrumb className='truncate font-thin'>
                {breadcrumbs.map((e, index) => (
                    <Breadcrumb.Item key={`${index + 1}`}>
                        {render(e)}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
        </>
    );
}