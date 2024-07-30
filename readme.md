# make .env file and add values before use by follow pattern below

### MongoDB (Split mongodb atlas link into sections)
DB_USER = ...
<br>
DB_PASS = ...
<br>
DB_HOST = ...
<br>
DB_NAME = ...
<br>
DB_OPTIONS = ...

### Frontend Link
FR_LINK = your frontend link
<br>
<br>
# SCB
### Authorization in get token function (นำ SCB_API_KEY และ SCB_API_SECRET มาผสมกันในรูปแบบ API_KEY แล้ว encode เป็น Base64 string)
AUTHORIZATION = Basic ...your authCode...
<br>
### Url for get token function
URL_GET_TOKEN = SCB API generates the access token
<br>
### Url for create qr code function
URL_CREATE_QR_CODE = SCB API QR code generation
<br>
### Application (SCB EASY Simulator App)
SCB_API_KEY = your API key

SCB_API_SECRET = your API secret
<br>
### Merchant Profile (found in SCB Developers)
Biller_ID = your biller id
<br>
### after that run
npm run start
