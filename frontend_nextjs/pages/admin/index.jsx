import React from 'react';
import { Card, Spin, Tooltip } from 'antd';
import UrlBreadcrumb from '../../src/components/common/UrlBreadcrumb';
import Overview from '../../src/models/Overview';
import { CaretDownOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { MapOverviewAqi } from '../../src/components/MapOverviewAqi';
import { useQuery } from 'react-query';
import { aqiToColor } from '../../src/utils/constant';

const detailAccountBread = [
    {
        name: 'Admin',
    },
    {
        name: 'Dashboard',
        url: '/',
    },
];

const Percentage = ({ up = true, value, ...props }) => (
    <div
        style={{
            color: up ? '#009551' : '#F53F3F',
            display: 'flex',
            alignItems: 'center',
        }}
        className='font-semibold flex gap-4'
        {...props}
    >
        <CaretDownOutlined
            style={{
                transform: up ? 'rotate(180deg)' : 'rotate(0deg)',
                marginRight: '0.25rem',
            }}
        />
        {up ? 'Số lượng tham gia trong tuần trước ' : 'Số lượng rời đi trong tuần trước '}
        <span>{value}</span>
    </div>
);

const OverviewCard = ({ label, value, isLoading }) => {
    return (
        <Card className='tablet:w-full flex-col  flex-1 gap-4 items-start rounded-xl shadow '>
            <Spin spinning={isLoading}>
                <div className='text-base'>{label}</div>
                <div className='font-bold text-4xl my-2'>{value?.total}</div>
                <Percentage value={value?.createdLastWeek} up={true} />
                <Percentage value={value?.removedLastWeek} up={false} />
            </Spin>
        </Card>
    );
};

const AQIItem = ({ rank, location, aqi }) => (
    <div className='flex justify-between items-center mb-[15px]'>
        <span className='text-sm font-medium '>#{rank}</span>
        <span className='text-sm font-medium  break-words max-w-[160px] mr-5 ml-5'>
            {location}
        </span>
        {
            aqi ?  <Tooltip title={aqi?.AQICategory} color={aqiToColor(aqi?.AQIGeneral)}>
            <span
                className='text-white text-sm font-semibold py-1 px-2'
                style={{ backgroundColor: aqiToColor(aqi?.AQIGeneral) }}
            >
                {aqi?.AQIGeneral}
            </span>
            </Tooltip> :<InfoCircleOutlined/>
        }

    </div>
);

const AdminPage = () => {
    const { isLoading: overviewUserIsLoading, data: overviewUser } = useQuery(
        'user',
        async () => await Overview.user()
    );
    const { isLoading: overviewLocationIsLoading, data: overviewLocation } =
        useQuery('location', async () => await Overview.location());
    const { isLoading: overviewSensorIsLoading, data: overviewSensor } =
        useQuery('sensor', async () => await Overview.sensor());

    const { isLoading: loadingAqiData, data: aqiData } = useQuery(
        'aqi',
        async () => {
            const data = await Overview.aqi({
                date: new Date().toISOString().split('T')[0],
                locationId: null,
            });
            /*return data.map((item) => ({
            aqi: item.AQIGeneral,
            position: {
                locationName : item?.location?.location_name,
                lat: item?.location?.latitude,
                lng: item?.location?.longitude,
            },
        }))*/
            return data;
        },
        {}
    );
    console.log(aqiData);
    return (
        <div className='p-4 tablet:p-0'>
            <UrlBreadcrumb breadcrumbs={detailAccountBread} />
            <div className='flex tablet:flex-col gap-6 items-center mt-8'>
                <OverviewCard
                    label='Số lượng người dùng '
                    isLoading={overviewUserIsLoading}
                    value={overviewUser}
                />
                <OverviewCard
                    label='Số lượng trạm quan trắc'
                    isLoading={overviewLocationIsLoading}
                    value={overviewLocation}
                />
                <OverviewCard
                    label='Số lượng thiết bị'
                    isLoading={overviewSensorIsLoading}
                    value={overviewSensor}
                />
            </div>
            <br />
            <br />
            <div className=' flex tablet:flex-col gap-6 '>
                <div className='w-1/4 tablet:w-full flex-col  h-full'>
                    <div className='p-3 bg-[#FAFAFA] border-[1px] border-[rgba(0, 0, 0, 0.6)] font-medium text-sm w-full'>
                        Trạm có AQI cao nhất
                    </div>
                    <div className='flex-col justify-center items-center mt-2 pt-[15px]'>
                        <Spin spinning={loadingAqiData}>
                            {aqiData &&
                                aqiData
                                    .slice(0, 5)
                                    .map((item, index) => (
                                        <AQIItem
                                            key={index}
                                            rank={index + 1}
                                            location={item?.location_name}
                                            aqi={item.data}
                                        />
                                    ))}
                        </Spin>
                    </div>
                </div>

                <div className='w-3/4 tablet:w-full items-center justify-center'>
                    {
                        aqiData && <MapOverviewAqi height={500} dataPoints={aqiData?.map(item=>({
                            position : {
                                lat:item.latitude,
                                lng : item.longitude
                            },
                            aqi : item.data?.AQIGeneral
                        }))}/>
                    }

                </div>

            </div>
        </div>
    );
};

export default AdminPage;
