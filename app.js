const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const request = require('request');


//mesibo signup


const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

const mesiboSignupUrl = 'https://api.mesibo.com/backend';


const mesiboAppId = "263578";
const mesiboApiKey ="9cbz6fesl1iosz065933hnxstrr9t1erul95sb7s5t61yc9qtf0i1x6fvxzdqolo";
const user = {
    

  "op":"useradd",
  "token": "ptlk9hdel1gqxf3p0s15f5f5gtusldej18tl794suzit",
  "user": {
	"address":"xyz@example.com",
  }
}


const formData = {
    app_id: mesiboAppId,
    token: mesiboApiKey,
    user: JSON.stringify(user)
};

request.post({url: mesiboSignupUrl, form: formData}, function(err, httpResponse, body) {
    if (err) {
        console.error('Error:', err);
        return;
    }

    console.log('User signup successful. Response:', body);
});

// // google signup using firebase

// // const express = require('express');
// // const app = express();


// const firebase = require('firebase/app');
// require('firebase/auth');

// const firebaseConfig = {
//   apiKey: "AIzaSyDlDiSOh174dAYBT7aRK5R94rshC7y_FMU",
//   authDomain: "r-own-backend.firebaseapp.com",
//   projectId: "r-own-backend",
//   storageBucket: "r-own-backend.appspot.com",
//   messagingSenderId: "1097487844125",
//   appId: "1:1097487844125:web:4f90611ab7d0a18eaa17f4",
//   measurementId: "G-WEGFDN07HB"
// };

// firebase.initializeApp(firebaseConfig);
// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// // admin.initializeApp();

// const { check, validationResult } = require('express-validator');
// const { OAuth2Client } = require('google-auth-library');





// // const CLIENT_ID = "1097487844125-et9tnikr24iikqturl69gq6r209l7074.apps.googleusercontent.com"; // Replace with your Google OAuth2 client ID
// // const client = new OAuth2Client(CLIENT_ID);

// // app.post('/signup/google', [
// //   check('token').notEmpty().withMessage('Token is required')
// // ], async (req, res) => {
// //   const errors = validationResult(req);
// //   if (!errors.isEmpty()) {
// //     return res.status(400).json({ errors: errors.array() });
// //   }

// //   const { token } = req.body;

// //   try {
// //     const ticket = await client.verifyIdToken({
// //       idToken: token,
// //       audience: CLIENT_ID,
// //     });
// //     const payload = ticket.getPayload();
// //     const { email, name } = payload;
// //     // Save the user to the database and generate a JWT token
// //     res.status(201).json({ token: generateToken(user) });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(400).json({ error: 'Invalid token' });
// //   }
// // });


// const serviceAccount = require('C:/Users/shubham singh/OneDrive/Desktop/Rown Application/r-own-backend-firebase-adminsdk-tozpp-1483d3c88f.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://r-own-backend.firebaseio.com'
// });


const CLIENT_ID = "55047490232-qc1apn1vi2nn1789bfmj5i6d8de990mv.apps.googleusercontent.com"
const googleClient = new OAuth2Client({ clientId: CLIENT_ID })


async function verifyGoogleLogin(token) {
  const ticket = await googleClient.verifyIdToken({
    audience: CLIENT_ID,
    idToken: token
  })
  const payload = ticket.getPayload()

  if (payload) {
    return payload
  }
  return null
}


app.post('/login', async (req, resp) => {
  const { provider, response } = req.body

  if (provider === "google") {
    const { idToken } = response
    const res = await verifyGoogleLogin(idToken)

    if(!res){
      console.log('failed to login')
    }

    console.log("sign in successfully",res)

  }

    resp.json({status:"ok"})
})

// git push R-own-BE dev

// const axios = require('axios');

// async function addUserToMesibo() {
//   const data = {
//     op: 'adduser',
//     appid: '263578',
//     name: 'shubham',
//     address:"9594892642"
//   };

//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer 4xzkje00pihxlu4ifvtlakctehhd7nwjoudwl5b10mimt8r8g9fq0r3wm7jgzk2c`,
//     },
//   };

//   try {
//     const response = await axios.post('https://api.mesibo.com/backend/', data, config);
//     const token = response.data.token;
//     return token;
//   } catch (error) {
//     console.error(error);
//   }
// }

app.listen(4000, () => {
  console.log('Server is running on port 3000');
});



