# MQTT SERVER

## Nhiệm vụ

- Bản thân server là một client đối với broker trong giao thức MQTT. Server đăng ký các channel dữ liệu và monitor thiết
  bị . Đối với channel dữ liệu, thực hiện lắng nghe các message validate và lưu vào queue , các bản tin bị sai sẽ được
  ghi log và gửi về web server
- Cứ sau một phút sẽ chạy job để insert lượng dữ liệu trong queue vào cơ sở dữ liệu MôngDb và xóa cache.
- Có 2 job nữa cũng được lập lịch chạy một ,job tính aqi(theo công thức công bố tại
  đây [http://cem.gov.vn/storage/news_file_attach/QD%201459%20TCMT%20ngay%2012.11.2019%20AQI.pdf](http://cem.gov.vn/storage/news_file_attach/QD%201459%20TCMT%20ngay%2012.11.2019%20AQI.pdf))
  , job tính trung bình các chỉ số
- Expose một số API để webserver gọi vào nhằm mục đích gửi bản tin đến thiết bị , đồng thời lắng nghe các channel đó
  để confirm lại trạng thái cho webserver cập nhật xuống cơ sở dữ liệu MySql

## Flow
- Routes --> Controller --> Service --> Schema
- Cronjob --> model

## Docker

**build image**:

```
    docker build -t phungvansyhb/airsense-mqtt-server .
```

**run image** :

```
    docker run -itd -p 3002:3002 phungvansyhb/airsense-mqtt-server
```
