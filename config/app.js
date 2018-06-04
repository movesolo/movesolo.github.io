var config = {
    apiKey: "AIzaSyBle3tGoXGEUkUJ1cjAIfCZ45cbuJMXWsQ",
    authDomain: "movesolo-bbc43.firebaseapp.com",
    databaseURL: "https://movesolo-bbc43.firebaseio.com" //,
        //projectId: "movesolo-bbc43",
        //storageBucket: "",
        //messagingSenderId: "818068850006"
};
firebase.initializeApp(config);

var app = angular.module('myApp', ['ngRoute', 'ngDialog', 'firebase', 'scrollToEnd', 'angucomplete-alt']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            controller: 'HomeController',
            templateUrl: 'views/home.html'
        })
        .when('/movies/:moviescategory', {
            controller: 'MoviesController',
            templateUrl: 'views/movies.html'
        })
        .when('/movie/:movieid', {
            controller: 'MovieController',
            templateUrl: 'views/movie.html'
        })
        .when('/post', {
            controller: 'PostController',
            templateUrl: 'views/post.html'
        })
        .when('/newpost', {
            controller: 'NewPostController',
            templateUrl: 'views/newpost.html'
        })
        .when('/box', {
            controller: 'BoxController',
            templateUrl: 'views/box.html'
        })
        .when('/account/:logstatus', {
            controller: 'AccountController',
            templateUrl: 'views/account.html'
        })
        .when('/:username', {
            controller: 'UserController',
            templateUrl: 'views/user.html'
        })
        .otherwise({ redirectTo: '/home' });
    //$locationProvider
    //    .html5Mode(true)
    //    .hashPrefix('!');
});

//  re-usable factory that generates $firebaseAuth instance
app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        return $firebaseAuth();
    }
]);

app.filter('rounded', function() {
    return function(input, decimals) {
        var exp, rounded,
            suffixes = ['K', 'M', 'G', 'T', 'P', 'E'];
        if (window.isNaN(input)) {
            return null;
        }
        if (input < 1000) {
            return input;
        }
        exp = Math.floor(Math.log(input) / Math.log(1000));
        return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
    };
});

app.filter('timeago', function() {
    return function(input, p_allowFuture) {

        var substitute = function(stringOrFunction, number, strings) {
                var string = angular.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
                var value = (strings.numbers && strings.numbers[number]) || number;
                return string.replace(/%d/i, value);
            },
            nowTime = (new Date()).getTime(),
            date = (new Date(input)).getTime(),
            //refreshMillis= 6e4, //A minute
            allowFuture = p_allowFuture || false,
            strings = {
                prefixAgo: '',
                prefixFromNow: '',
                suffixAgo: "ago",
                suffixFromNow: "from now",
                seconds: "few sec's",
                minute: "1 min",
                minutes: "%d min's",
                hour: "1 hr",
                hours: "%d hr's",
                day: "1 day",
                days: "%d day's",
                month: "1 mon",
                months: "%d mon's",
                year: "1 yr",
                years: "%d yr's"
            },
            dateDifference = nowTime - date,
            words,
            seconds = Math.abs(dateDifference) / 1000,
            minutes = seconds / 60,
            hours = minutes / 60,
            days = hours / 24,
            years = days / 365,
            separator = strings.wordSeparator === undefined ? " " : strings.wordSeparator,


            prefix = strings.prefixAgo,
            suffix = strings.suffixAgo;

        if (allowFuture) {
            if (dateDifference < 0) {
                prefix = strings.prefixFromNow;
                suffix = strings.suffixFromNow;
            }
        }

        words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
            seconds < 90 && substitute(strings.minute, 1, strings) ||
            minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
            minutes < 90 && substitute(strings.hour, 1, strings) ||
            hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
            hours < 42 && substitute(strings.day, 1, strings) ||
            days < 30 && substitute(strings.days, Math.round(days), strings) ||
            days < 45 && substitute(strings.month, 1, strings) ||
            days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
            years < 1.5 && substitute(strings.year, 1, strings) ||
            substitute(strings.years, Math.round(years), strings);
        prefix.replace(/ /g, '')
        words.replace(/ /g, '')
        suffix.replace(/ /g, '')
        return (prefix + ' ' + words + ' ' + suffix + ' ' + separator);

    };
});

app.service('metaTag', function() {
    var title = '';
    var metaDescription = '';
    var metaKeywords = '';
    return {
        set: function(newTitle, newMetaDescription, newKeywords) {
            metaKeywords = newKeywords;
            metaDescription = newMetaDescription;
            title = newTitle;
        },
        metaTitle: function() { return title; },
        metaDescription: function() { return metaDescription; },
        metaKeywords: function() { return metaKeywords; }
    }
});