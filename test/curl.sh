http --verify=no https://localhost/customer/microservices/time
curl -k --request GET  --url https://localhost/customer/microservices/time
http --verify=no https://localhost/customer/microservices/addressconsult/time  X-COLCO-Client-Id:1234567
curl -k --request GET  --url https://localhost/customer/microservices/time   --header "X-COLCO-Client-Id: 1234567"
