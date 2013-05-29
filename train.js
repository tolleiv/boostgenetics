
var fetch = require('./app/fetch').fetch
var optimize = require('./app/optimize')
var extract = require('./app/extract')
var Process = require('./app/process').process

var process = new Process();
process.crunch(extract.parseDom);
process.crunch(extract.getPosition);

var costFunction = function(options) {
    var c=0;
    var fO = function(q,v) {
        var o = {
            host:options.host,
            port:options.port,
            path:options.path
        };
        o.path = o.path + encodeURI(q) + options.fields;
        for(var i=0;i< v.length;i++) {
            o.path = o.path.replace(new RegExp('__'+i+'__'), v[i])
        }
        return o;
    };
    var cache={};
    var costf = function(v, emit) {
        var sum = 0, cacheKey= v.join(';');

        if (cache.hasOwnProperty(cacheKey)) {
            emit({v:v, c:cache[cacheKey]});
            return;
        }

        var repeater = function(i, sum) {
            if (i >= options.data.length) {
                cache[cacheKey]=sum/options.data.length;
                emit({v:v, c:cache[cacheKey]});
                return;
            };
            c=c+1;
            fetch(options.data[i].doc, function(content) {
               var d = process.run(options.data[i].doc, content);
               sum=sum+Math.pow(d.position<options.data[i].pos?0:(d.position-options.data[i].pos), 2);
               repeater(i+1,sum);
            }, null, fO(options.data[i].search, v));
        }
        repeater(0, sum);
    };
    return costf;
};


exports.train = function(options, emit) {
    var type = !options.type ? 'gen' : options.type;
    optimize[type+'Optimize'].call(this, options.domain, costFunction(options), emit, 20, 50, 0.3, 0.2, parseInt(options.iterations));
};
exports.test = function(options, emit) {
    var costf = costFunction(options);
    costf(options.vector, function(o) {o.done = true; emit(o); });
};

