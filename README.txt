#ergface

This is the code for http://ergface.cloudfoundry.com/.  ErgFace is an application to publish your indoor rowing scores 
to the Facebook Timeline and Ticker using the Open Graph protocol. It's written using node.js and jquery mobile with a 
mongodb data store and running on the cloudfoundry.com platform. 

The code should be fully functional, but I don’t claim that it’s very good :)  It was a proof of concept to explore 
node.js, mongo, cloud foundry and the FB timeline.  

app.js handles creating the server, connecting to mongo and persisting the data, and it also handles the callback for FB 
Open Graph.  It could be improved by using a framework like Express.  Also, it doesn’t handle all links from FB due to 
the way the server is done (simple case statements).  

The rest of the code is a simple interface utilizing jquery mobile to allow users to enter a score (date, distance, split 
(optional), time (optional)).  