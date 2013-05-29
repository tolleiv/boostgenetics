Boost Genetics
==============

Running the application
----------------------------

* Install NodeJS [NodeJS]
* Run 'npm install'
* Run  node app.js
* Open [the application] in your browser-window


Field usage
----------------------------

* __Host__: The host where Solr can be found (e.g. localhost)
* __Port__: The port where Solr can be found (e.g. 8080)
* __Path__: The base path to the select  where handler, the query parameter has to be the last one (e.g. /solr/rfcs/select?defType=dismax&rows=50&fl=id&q=)
* __Fields__: The query fields which should be optimized, actual factors replaced by placeholders (e.g. &qf=title^__0__%20keywords^__1__%20abstract^__2__%20sec1^__3__%20text^__4__%20titles^__5__%20references^__6__%20author^__7__)
* __Iterations__: The amount of generations to run the optimization through - 50 seems to be a good start
* __Domain__: The allowed value range for the factors - must match to the amount of placeholders in your fields string (e.g. [[1,100],[1,100],[1,100],[1,100],[1,100],[1,100],[1,100],[1,100]])


Licence:
----------------------------



Credits:
----------------------------



[NodeJS]: http://nodejs.org/download/
[the application]: http://localhost:3000
