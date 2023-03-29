
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


var admin = require("firebase-admin");

admin.initializeApp({
    // Replace with your Firebase service account JSON file
    credential: admin.credential.cert({
      projectId: 'r-own-backend',
      clientEmail: 'firebase-adminsdk-tozpp@r-own-backend.iam.gserviceaccount.com',
      privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC6SgVepSAbMqCS\nZizhXwB+Y7PQP90JvvfmRRDRDvkb3jhLfbjgHMt8OvsTTumjUGTz2btIig24dUpQ\nOyRXmCzOO467Kum8I+UAD3bPLVcX3MSb7w1GQ21VCBOlLnrjkCN4ap2FAb9Fx6JJ\nKa9N5LBPVGGHIJygJa6zE4qk178MPzcu98EJUnfIc4ascxhcvr4E3yqW2hib15Mx\nzSGWt8yc/se6HDAQOxQZoKlIcnfl5iieRcUowyFl8XGDoxWrZ9uylkahRVkNUI8o\nwEIz5XNEqadbodFR1oQUESSaI2wd/gKiCeVcfL+uinv4bGi933MWNysZPqP/3rrn\nYEelDO0nAgMBAAECggEAB+xpEQ798Bo1qTRuWUGksDuGZOeqe6UjPyiV4AZ+gvhv\nNYrJ58Jhx01s63PSTS94s8SBikLQ9ZULjaEOWSlwUm9HEV/wZB+0uE1wFLzNdQbf\nV/CRhHkOt+yphT+WW4KAd7k1LPiXjZzBotICklIVS7J/mXNCJi+kIBrHLV690gP1\nmQMAuDAR/0xEmz+RZjnDSdxdbP1Q+eXeRU65UIozzDqQTg8n+N/wEFURSzznd/lp\nV0+BbgD86R5y5PFvMNtpaizlopKFATnwTTdxCRQkmgQQOyz3+cyyPr7uJ6ojtA9Q\nAsDZkNA4pJTJ5C/1aa7KXEqyu4MggExE4Oa/aGMCVQKBgQD3OvlfkNtl6DWILSOf\nyT6gEu/Dq7OGOvh+8lsN75e/m7lKjDgwW/cPzT4wAFHqoSnlK/kQCTWzbScknVCd\nqmkRiwK5fFJVOA+5MrLxSQmT+YC6tIU58lS5bwa8Jxx+B/0gWVgCn9hxi5MH4pO/\nJcvgFfTY9kRsU9akqU0TJ9wUAwKBgQDA5ahaSibgtWAHcze3mKyoSdtDWC/OAgQ2\nWYc7/d17lb2/nPkSqn4/gmtqmv5G7msMmTUVOz/Vds4/jA+BkwJYrhdbaqP7FfVv\nCrGAEx0bYykV3ch/yrZ09vHN7BbUiVnqONHQ830vnk/lgheES2sjaNuY4QEaqGzR\nTU8CbLajDQKBgChcVVe3o0motgyMKfOs++9QCBpujnlMaUL4N8s3oRNjzcUQzR9/\n8/59aDiX5MekFd3W5usqRb0MBcbhc8a5ijuV8RTs6dgFtfNrBnGDle+1XMGeNN23\n5QL80CGpVOpyTW2ZiFetVr16pr8zyyD6f6UOkJFW6uawbSsmhHGrIS+XAoGAPoQv\n49NUdk9SKBf3XtFkY8ZMAa97DtEofFTXt2G3fm4xaQB+2MXY1Mx387z33BU5LIQa\n6B6juZMflQjXna7/e64wc7hEHQQo3ywgCtom/NFOZ3/Rk1kneRDvnUV+wLMjKP3x\nQj8nu18blc5rwLyQpJE/WnTR3snnOo5LpQWGy6ECgYAzg7SMveI7pJ7dQzqFuVAJ\nF2VVt9FSco179lYJ+j5Cxe7N3yogTRJKC7VS+XXv2m7VkpLFwyrfu08Bil1+D4+P\nNkmMNI0/xyxqCieGI72WzykRwx9gukAEMmNBTw5isibBgsaIse6Ic937nv4FVHHE\n8vTBLCrmKIEIzguPSYecvA==\n-----END PRIVATE KEY-----\n',
    }),
  });



const db = admin.firestore();
const usersRef = db.collection('users');

app.use(bodyParser.json());

app.post('/api/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;

    // Check if the user already exists in Firestore
    const snapshot = await usersRef.where('mobile', '==', mobile).get();

    if (snapshot.empty) {
      // User doesn't exist, save the mobile number to Firestore
      const newUserRef = usersRef.doc();
      const newUser = { id: newUserRef.id, mobile };
      await newUserRef.set(newUser);

      // Send OTP to the mobile number
      const auth = admin.auth();
      const verificationResult = await auth.verifyPhoneNumber(`+91${mobile}`);
      const verificationId = verificationResult.multiFactor.sessionInfo.uid;

      res.status(200).send({ verificationId });
    } else {
      // User already exists
      const user = snapshot.docs[0].data();
      const verificationId = user.verificationId;

      res.status(200).send({ verificationId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

app.post('/api/verify-otp', async (req, res) => {
  try {
    const { verificationId, code } = req.body;

    const auth = admin.auth();
    const credential = await auth.signInWithPhoneNumber(verificationId, { sessionInfo: { multiFactorHint: undefined, multiFactorUid: undefined } }, code);
    const token = await credential.user.getIdToken();

    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
