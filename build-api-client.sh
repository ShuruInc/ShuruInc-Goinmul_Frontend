npx dotenv -- swagger-typescript-api --clean-output --default-response json --union-enums --modular -n ApiHttpClient -o Main/src/api/api_http_client -p $1
sed -i 's/same-origin/include/g' Main/src/api/api_http_client/http-client.ts
