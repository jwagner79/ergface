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

CloudFoundry

Here's some notes from my cloudfoundry experience.  I don't come from a Ruby background so this was a completely new 
experience for me.  When I developed ergface cloud foundry was brand spanking new so things may have changed.  

Here's what I tagged to get started: http://delicious.com/jwagner/cloudfoundry

My application kept crashing and I couldn't figure out why.  Then I discovered: 
vmc log <appname>  AND vmc crashlog <appname>
Sounds simple, but it was a huge help for me

I also eventually learned you can change your password :) You can find helpful commands here:
https://github.com/cloudfoundry/vmc