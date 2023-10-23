import React from 'react';

function PageAdminLayout({ pageName, children, ...props }) {
    return (
        <div className='bg-white border rounded-lg w-full min-h-screen p-6 mt-2 tablet:p-2 tablet:mt-0 wrapper-admin-layout'>
            <h2 className='uppercase font-semibold text-xl mb-6'>{pageName}</h2>
            {children}
        </div>
    );
}

export default PageAdminLayout;
