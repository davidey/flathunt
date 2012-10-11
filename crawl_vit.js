// Count all of the links from the nodejs build page
var jsdom       = require("jsdom"),
    mongoose    = require('mongoose'),
    db          = mongoose.createConnection('localhost', 'flathunt'),
    schema      = new mongoose.Schema({
        'id'    : String,
        'title' : String,
        'date'  : String,
        'price' : String,
        'link'  : String
    }),
    Flat        = db.model('Flat', schema),
    $;

var storeData   = function(element) {
        var entry   = new Flat(),
            results = [];

        entry.id    = element.find('a').attr('id').match(/([0-9]+)/g)[0];
        entry.title = element.find('a span').text();
        entry.date  = element.find('span.post-date').attr('title');
        entry.price = element.find('span.price').text().match(/[0-9]+/g)[0];
        entry.link  = element.find('a').attr('href');

        results.push(entry);

        entry.save(function (err) {
            if (err) throw err;
            console.log('saved "' + entry.title + '"');
        });
    },
    jsdomCallback = function(errors, window) {
        $ = window.$;
        var search  = $('#search-results').children();
    
        search.each(scanTagNames);

        window.close();
        return;
    },
    scanPage    = function(url) {
        if(typeof url != "string" || url.length < 3) {
            console.log('No url.. return');
            return false;
        }
        console.log('Scanning url "' + url + '"');

        jsdom.env(
            url,
            [
                'http://code.jquery.com/jquery-1.7.min.js'
            ],
            jsdomCallback
        );
    },
    getNextUrl  = function(searchBlock) {
        console.log('getNextUrl called...');
        if($('#search-results h3.ad-group-header').length == 1 && /^Today/.test($('#search-results h3.ad-group-header').text())) {
            var navigation = $('nav#pagination li.pag-next a');
            if(navigation.length < 1) {
                console.log('Navigation not found... returning');
                return "";
            } else {
                return navigation.attr('href');
            }
        } else {
            return "";
        }
    },
    scanTagNames= function() {
        var element = $(this);
        switch(element.prop('tagName')){
            case 'H3':
                if(!/^Today/.test(element.html())){
                    console.log('Limit found: ' + element.html());
                    return 0; 
                }
                break;
            case 'UL':
                console.log('Classes: ' + element.attr('class'));
                if(element.hasClass('ad-listings') && !element.hasClass('featured')) {
                    console.log('Not feature... proceed');
                    var links = element.find('li');
                    console.log('Links length: ' + links.length);
                    links.each(function() {
                        var el = $(this);
                        storeData(el);
                    });

                    console.log('done');

                    return scanPage(getNextUrl(links));
                }
            break;
            default:
                console.log('Skip ' + element.prop('tagName'));
        }
    };

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    scanPage("http://www.gumtree.com/flats-and-houses-for-rent-offered/london");
    return;
});
