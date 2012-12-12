
var randInt = function(low,up) {
    return Math.floor(low + Math.random() * (up+1-low))
};

var incVector = function(vec, p, inc, domain) {
    var n=[];
    for(var i=0;i<vec.length;i++) {
        n[i]=vec[i];
    }
    var s = n[p]+inc;
    n[p] = inc>0?(s>domain[1]?domain[1]:s):(s<domain[0]?domain[0]:s);
    return n;
};

var randomVector = function(domain) {
    var vec=[];
    for(var i=0;i<domain.length;i++) {
        vec.push(randInt(domain[i][0], domain[i][1]))
    }
    return vec;
};

var compareScored = function(a,b) {
    if (a.c < b.c)
       return -1;
    if (a.c > b.c)
      return 1;
    return 0;
};

var cp = function(v) {
    var n=[];
    for(var i=0;i< v.length;i++) {
        n[i]=v[i];
    }
    return n;
}

exports.optimize = function(domain, costf, emit, popsize, step, mutprod, elite, maxiter) {

    var mutate = function(vec) {
        var i = randInt(0, domain.length-1);
        if (Math.random()<0.5 && vec[i]>domain[i][0]) {
            return incVector(vec,i,-step,domain[i])
        } else if (vec[i]<domain[i][1]) {
            return incVector(vec,i,step,domain[i])
        }
    };
    var crossover = function(r1,r2) {
        var i = randInt(1, domain.length-2);
        return r1.slice(0,i).concat(r2.slice(i))
    };
    var initPopulation=[];
    for (var i=0;i<popsize;i++) {
        initPopulation.push(randomVector(domain));
    }

    var topelite = Math.floor(elite*popsize);
    var iterator = function(i,population) {
        step=Math.ceil(step*0.95);
        if (i>=maxiter) {
            costf(population[0], function(o) {
                o.done = true;
                emit(o);
            });
            return;
        }

        var repeater = function(r, s, emit) {

            if (r >= population.length) {
                emit(s);
                return;
            }
                // TODO: Find out why this is needed
            if (!population[r]) { repeater(r+1,s, emit); return; }

            costf(cp(population[r]), function(o) {
                s.push(o)
                repeater(r+1,s, emit);
            })
        };
        repeater(0, [], function(scored) {
            var ranked=[];
            scored.sort(compareScored);

            while(ranked.length<topelite) {
                ranked.push(scored.shift().v)
            }

            while(ranked.length < popsize) {
                if (Math.random()<mutprod) {
                    var c=randInt(0,topelite-1)
                    ranked.push(mutate(cp(ranked[c])))
                } else if (Math.random()<mutprod) {
                    var c1=randInt(0,topelite-1)
                    var c2=randInt(0,topelite-1)
                    ranked.push(crossover(cp(ranked[c1]), cp(ranked[c2])))
                } else {
                    ranked.push(randomVector(domain))
                }
            }

            emit(scored[0]);
            iterator(i+1, ranked);
        });
    };
    iterator(0,initPopulation);
};