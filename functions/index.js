const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true, });

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


/*
exports.sendAdminNotification = functions.database.ref('/sensorservice/notify/{pushId}').onCreate((snapshot, context) => {

    const message = snapshot.val();
    var msg;

    return loadTokens().then(tokens => {
        let tokensArray = [];
        for (let item of tokens) {
            if (item.token != null && item.token != undefined && item.token != '' && item.allow) {
                tokensArray.push(item.token);
            }
        }

        if (message.c == 'w') {
            msg = "El sensor " + message.msg + " generó una advertencia"
        } else {
            msg = "El sensor " + message.msg + " funciona normalmente"
        }

        let payload = {
            notification: {
                title: "Funat: Sensores",
                body: msg,
                icon: "https://cloud.google.com/_static/79b638f791/images/cloud/products/icons/compute.svg",
                click_action: "https://funat-firebase.firebaseapp.com/sensors"
            }
        };
        return admin.messaging().sendToDevice(tokensArray, payload);

    });

    function loadTokens() {
        let dbRef = admin.database().ref('/tokens');
        let defer = new Promise((resolve, reject) => {
            dbRef.once('value', (snap) => {
                let data = snap.val();
                let tokens = [];
                for (var property in data) {
                    tokens.push(data[property]);
                }
                resolve(tokens);
            }, (err) => {
                reject(err);
            });
        });
        return defer;
    }
})
*/

/*export const productControlNotify = functions.database.ref('/sensorservice/notify/{pushId}').onCreate((snapshot, context) => {
    // body of function
});*/


exports.CreateUserRequest = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method == 'GET') { //Verifica si es GET
            const request = admin.database().ref('/users') // Referencia a la base de datos
            request.on('value', (snapshot) => {
                res.status(200).send(snapshot.val()) //Manda los datos obtenidos en JSON
            })
        } else if (req.method == 'POST') {
            const body = req.body // El objeto que mandemos.

            console.log(body)

            admin.auth().createUser({
                email: body.mail,
                emailVerified: false,
                //phoneNumber: body.phoneNumber,
                password: body.pass,
                displayName: body.name,
                //photoURL: body.photoURL,
                disabled: false
            }).then(function (userRecord) {
                console.log('Successfully created new user:', userRecord.uid);
                var request = admin.database().ref('/users/' + userRecord.uid)

                admin.auth().setCustomUserClaims(userRecord.uid, body.role).then(() => {
                    console.log('Successfully set claims!');
                    request.set({ name: body.name, mail: body.mail, roles: body.role }).then(() => {
                        console.log('Successfully added to database!')
                        request.once('value').then((snap) => {
                            console.log(snap.val())
                            res.status(201).send(snap.val())
                        }).catch(error => {
                            console.log("error");
                            res.status(200).send(error)
                        })
                    }).catch(error => {
                        res.status(200).send(error)
                    })
                }).catch(error => {
                    res.status(200).send(error)
                });
            }).catch(err => {
                console.log('Error creating new user:', err);
                res.status(200).send(err)
            })
        }
    });
})


exports.ChangeClaimUserRequest = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method == 'GET') { //Verifica si es GET
            const request = admin.database().ref('/users') // Referencia a la base de datos
            request.on('value', (snapshot) => {
                res.status(200).send(snapshot.val()) //Manda los datos obtenidos en JSON
            })
        } else if (req.method == 'POST') {
            const body = req.body // El objeto que mandemos.

            console.log(body)

            var request = admin.database().ref('/users/' + body.key)

            admin.auth().setCustomUserClaims(body.key, body.roles).then(() => {
                console.log('Successfully updated claims!');
                request.update({ roles: body.roles }).then(() => {
                    console.log('Successfully updated to database!')
                    request.once('value').then((snap) => {
                        console.log(snap.val())
                        res.status(201).send(snap.val())
                    }).catch(error => {
                        console.log("error");
                        res.status(200).send(error)
                    })
                }).catch(error => {
                    res.status(200).send(error)
                })
            }).catch(error => {
                res.status(200).send(error)
            });
        }
    });
})


exports.DeleteUserRequest = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method == 'DELETE') {
            admin.auth().deleteUser(req.body.uid)
                .then(function () {
                    console.log('Successfully deleted user');

                    const request = admin.database().ref('/users/' + req.body.uid) // Referencia a la base de datos
                    request.remove().then(function () {
                        res.send({ status: "ok", response: "deleted" })
                    }).catch(error => {
                        console.log('Error deleting data:', error);
                        res.send({ status: 'error', error: error });
                    })
                    //Borrar de database
                })
                .catch(function (error) {
                    console.log('Error deleting user:', error);
                    res.send({ status: 'error', error: error });
                });
        }
    })
})

exports.CustomClaimsUserRequest = functions.https.onRequest((req, res) => {

    //res.set('Access-Control-Allow-Origin', "*")

    cors(req, res, () => {
        if (req.method == 'GET') { //Verifica si es GET
            const request = admin.database().ref('/users') // Referencia a la base de datos
            request.on('value', (snapshot) => {
                res.status(200).send(snapshot.val()) //Manda los datos obtenidos en JSON
            })
        } else if (req.method == 'POST') {
            const body = req.body // El objeto que mandemos.
            console.log(body)
            admin.auth().getUser(body.uid).then(user => {
                res.status(200).send(user)
            }).catch(error => {
                res.status(403).send(error)
            })
        }
    })
})

/*exports.readNotifications = functions.database.ref('/sensorservice/general/read').onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();
    if(data == previousData) return null;
})*/

//DevMode
/*var serviceAccount = require("C:\\Users\\Carlos\\Desktop\\Prueba\\quipu\\quipu\\functions\\service.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quipu9.firebaseio.com",
});*/
//DevMode
/*exports.CreateUserRequest = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      if (req.method === "GET") {
        //Verifica si es GET
        const request = admin.database().ref("/users"); // Referencia a la base de datos
        request.on("value", (snapshot) => {
          res.status(200).send(snapshot.val()); //Manda los datos obtenidos en JSON
        });
      } else if (req.method === "POST") {
        //Create user
        const body = req.body;
        console.log(body);
        console.log(body.role);
        var userRecordReg = null;
  
        admin
          .auth()
          .createUser({
            email: body.mail,
            emailVerified: false,
            //phoneNumber: body.phoneNumber,
            password: body.pass,
            displayName: body.name,
            //photoURL: body.photoURL,
            disabled: false,
          })
          .then((userRecord) => {
            userRecordReg = admin.database().ref("/users/" + userRecord.uid);
            console.log("Successfully created new user:", userRecord.uid);
            return admin.auth().setCustomUserClaims(userRecord.uid, null);
          })
          .then(() => {
            console.log("Successfully set claims!");
            return userRecordReg.set({
              name: body.name,
              mail: body.mail,
              roles: body.role,
              tokens: 100
            });
          })
          .then(() => {
            console.log("Successfully added to database!");
            return userRecordReg.once("value");
          })
          .then((snap) => {
            console.log(snap.val());
            res.status(201).send(snap.val());
            return;
          })
          .catch((error) => {
            res.status(200).send(error);
          });
      }
    });
  });*/