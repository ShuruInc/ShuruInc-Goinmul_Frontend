@echo off
cd %~dp0
npx dotenv -- swagger-typescript-api --clean-output --default-response json --union-enums --modular -n ApiHttpClient -o Main/src/api/api_http_client -p %1 && powershell -Command "(gc ./Main/src/api/api_http_client/http-client.ts) -replace 'same-origin', 'include' | sc ./Main/src/api/api_http_client/http-client.ts"