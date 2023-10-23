## AIRSENCE-20212

1. Intro

2. How to install
   require nodejs v14+ , npm
   ```
    yarn install
   ```
   not have yarn : `npm install -g yarn`

   > if run error on window OS follow
   link https://www.nextofwindows.com/fix-unable-to-run-yarn-in-windows-terminal-powershell

3. Database setup & migration
    1. create database 'airsense' in your local , and set enviroment in .env file
    2. import table
   ```
        db-migrate up -e mysql
   ```
   > make sure your .env file correct or contact author

    2. (for dev) run all migration in folder
    ```
        db-migrate up | <fileName> | -e (mysql , mongo)

    ```
    - no fileName : run all in directory
    - -c <number> : run specific number in dir
    - -e (prod , dev , test) : specific which config choosed

    3. (for dev) undo migration :
    ```
        db-migrate down | <filename> | -c <number> -e (mysql , mongo)
    ```
    - down all use : db-migrate reset

    4. (for dev) create fileTemplate cmd :
    ```
        db-migrate create <fileName> -e (mysql , mongo)
    ```
   > File name should be init with rule : alterTableX , createTableX

   > Naming convention : table name should be Noun and singular , M-N table reference should named as N-ref-M , field
   should named as pascalCase ex : phone_number , foreign key should be name as <table_ref_name>_id ex : user_id , each
   table should have id , created_at , update_at , deleted_at field
    - this will create xxxxxxxxxxxx-<fileName>-down.sql and xxxxxxxxxxxx-<fileName>-up.sql file in migrations/sqls ,we
      should copy sql statement to those
4. How to run
   ```
   yarn dev
   ```
5.Get Refresh Token GoogleMail
   access : https://developers.google.com/oauthplayground
   chọn setting use your owner OAuth creditial , nhập thông tin trong file env
   chọn service : https://mail.google.com/
   chinh credential , vào mail đã đăng ký , lấy refresh token (sẽ expire sau 1 tuần)
