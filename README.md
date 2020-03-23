# Ideator-Enc

[Ideator-Enc](https://ideator.officialk.codes/) is a Progressive Web App that lets the community share Ideas with thier team in an encrypted format so that they are secure and accessible only to people You wish to share them with.
This is an open source project which accepts any and all contributions from the awesome community members like you.

## New To Open Source? 
[How to Contribute](https://opensource.guide/how-to-contribute/)

## Installation
### Prerequisites
```
git
nodejs
mysql(or xampp)
firebase
```
Clone the repository to your local machine
```git
git clone https://github.com/officialk/Ideator-Enc.git
```
Install node dependencies
```npm
npm install express mysql randomstring #needed
npm install nodemon --save-dev
```
Setup Database
```
import the database
edit the server/keys.js file with login,database and table names if names are changed
```
Setup Firebase(Optional)
```md
add a firebase project with authentication for google signup
copy and paste your config to public/js/firebase.js
```
## Usage

```npm
npm run dev #for testing
npm start #for deploying
node index #for deploying
go to your browser at localhost:8282
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Code Of Conduct
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)

## License
[MIT](https://github.com/officialk/Ideator-Enc/blob/master/LICENSE.md)
