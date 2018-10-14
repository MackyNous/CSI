// By Robert-Jan Buddenbohmer

var mysql = require('mysql');
// Connectie met database opzetten
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'CSI'
 });

connection.connect(function(err){
 if(!err) {
     console.log("Database is connected ... \n\n");  
 } else {
     console.log("Error connecting database ... \n\n");  
 }
 });

(function() {
	var dbservice = (() => {
		var areCredsValid = (usr,pass) => { 
			//check if the combination of username and password exists in the DB
			// SQL injectie is niet mogelijk aangezien het framework dit afvangt. TODO: Best pactice voor creeeren sql string toepassen.
		       var sql = "SELECT COUNT(*) as found FROM user where name='"+ usr + "' AND password='"+pass+"'";
                       return new Promise( ( resolve, reject ) => {
            			connection.query( sql, ( err, rows ) => {
                		if ( err )
                    			return reject( err );
                		resolve( rows[0].found );
            			} );
     		       } );

                }


		return { areCredsValid: areCredsValid}	
	})()

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		//node
		module.exports = dbservice;
	} else {//browser
		window.nocrypto = dbservice;
	}

	
})();
