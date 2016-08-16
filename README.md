# glide for Chrome

A Concourse CI extension for Hack Week

![alt tag](http://storage6.static.itmages.com/i/16/0816/h_1471387593_9487261_e3e5493432.png)
![alt tag](http://storage3.static.itmages.com/i/16/0816/h_1471387702_6964769_b63edb726e.png)

### Things that the extension does

* Enter your concourse url in the form https://your.url and hit save to load your pipelines
* A white dot next to a pipeline means one or more of your resource's most recent build was not successful (it may be Pending, Paused, Aborted, etc.)
* Clicking on the pipeline will open the list of resources
* The color of the circle next to the resource indicates it's current status, these colors align with the statuses on Concourse. No color? That means it was a success!
* Clicking a resource will load the most recent 10 builds and their statuses
* The (+) button works like it does on Concourse, it runs a new build for that resource
* An (X) button will appear on build squared that are Pending or Started, this will Abort those builds

### Things that the extension does not do

* Check to make sure the URL entered is valid, or parsed right (or notifications if it is wrong)
* Authorization for Concourse sites not open to the public
* Use npm to install packages (I'm sorry)
* The ng-animate only works for opening pipeline tabs, not the resource tab
* No integration with DM
* Not on the Chrome store
* No Concourse Pipeline

(I started with a boilerplate from http://extensionizr.com/ so there may be some leftovers from that)
