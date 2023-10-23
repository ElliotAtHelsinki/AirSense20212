import React from 'react';

export default function EmptyContentTable() {
    return (
        <div className='py-28'>
            <div className='flex justify-center'>
                <svg
                    width='64'
                    height='64'
                    viewBox='0 0 64 64'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M44.5711 17.7013V14.2727C44.5711 13.9584 44.314 13.7013 43.9997 13.7013H16.5711C16.2569 13.7013 15.9997 13.9584 15.9997 14.2727V17.7013C15.9997 18.0155 16.2569 18.2727 16.5711 18.2727H43.9997C44.314 18.2727 44.5711 18.0155 44.5711 17.7013ZM16.5711 23.987C16.2569 23.987 15.9997 24.2441 15.9997 24.5584V27.987C15.9997 28.3013 16.2569 28.5584 16.5711 28.5584H29.714C30.0283 28.5584 30.2854 28.3013 30.2854 27.987V24.5584C30.2854 24.2441 30.0283 23.987 29.714 23.987H16.5711ZM26.8569 56.2727H10.2854V5.98697H50.2854V30.5584C50.2854 30.8727 50.5426 31.1298 50.8569 31.1298H54.8569C55.1711 31.1298 55.4283 30.8727 55.4283 30.5584V3.12983C55.4283 1.86554 54.4069 0.844116 53.1426 0.844116H7.42829C6.16401 0.844116 5.14258 1.86554 5.14258 3.12983V59.1298C5.14258 60.3941 6.16401 61.4155 7.42829 61.4155H26.8569C27.1711 61.4155 27.4283 61.1584 27.4283 60.8441V56.8441C27.4283 56.5298 27.1711 56.2727 26.8569 56.2727ZM58.6926 59.9513L52.0283 53.287C53.6211 51.1798 54.5711 48.5513 54.5711 45.7013C54.5711 38.7584 48.9426 33.1298 41.9997 33.1298C35.0569 33.1298 29.4283 38.7584 29.4283 45.7013C29.4283 52.6441 35.0569 58.2727 41.9997 58.2727C44.5569 58.2727 46.9283 57.5084 48.914 56.2013L55.6783 62.9655C55.7926 63.0798 55.9354 63.1298 56.0783 63.1298C56.2211 63.1298 56.3711 63.0727 56.4783 62.9655L58.6926 60.7513C58.7453 60.6988 58.7871 60.6365 58.8156 60.5679C58.8442 60.4992 58.8588 60.4256 58.8588 60.3513C58.8588 60.2769 58.8442 60.2033 58.8156 60.1347C58.7871 60.066 58.7453 60.0037 58.6926 59.9513ZM41.9997 53.7013C37.5783 53.7013 33.9997 50.1227 33.9997 45.7013C33.9997 41.2798 37.5783 37.7013 41.9997 37.7013C46.4211 37.7013 49.9997 41.2798 49.9997 45.7013C49.9997 50.1227 46.4211 53.7013 41.9997 53.7013Z'
                        fill='black'
                        fillOpacity='0.45'
                    />
                </svg>
            </div>

            <p style={{ color: '#939393' }}>
                Không có dữ liệu theo thông tin tìm kiếm
            </p>
        </div>
    );
}
