# INSTALLATION

1. install all libs

   ```
   yarn install
   ```

2. copy env_example to .env

   ```
   cp .env.example .env
   ```

3. make sure your database is READY!

4. run migration & seeder

5. run app

   ```
   yarn dev
   ```

# HOW TO SETUP PRISMA

1. install prisma
    ```
    yarn add -D prisma
    ```

2. init prisma
    ```
    npx prisma init --datasource-provider mysql
    ```

3. run migration
    ```
    npx prisma migrate dev
    ```

4. run seeder
   ```
   npx prisma db seed
   ```
