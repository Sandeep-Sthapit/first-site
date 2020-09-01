import pandas as pd 

def read_badge_data():
    """Reads the badge data from csv
    
    returns: the pandas dataframe of the csv data"""

    badge_data = pd.read_csv("../badges.csv")

    return badge_data

def make_html():
    """Format ready HTML"""

    html_string = """<!DOCTYPE html>
    <html>
        <head>
            <!--This was generated via the Python Script I wrote in 'create_html.py'. If you ever make a new badge, please
            add that to the 'badges.csv', then rerun that script once, and it will make it Facebook scraper ready!ENSURE
            TO CHANGE THE SVG IMAGE URLS TO PNGs! Facebook DOES NOT like SVGs!
            -->
            <meta property="og:url"                content="https://sandeep-sthapit.github.io/badges/%s.html" />
            <meta property="og:type"               content="website" />
            <meta property="og:description"              content="%s">
            <meta property="og:title"        content="How much do you know about COVID-19? Take the quiz and share your badge!">
            <meta property="og:image"              content="%s" />

            <link rel="stylesheet" href="../styles.css">
            <style>
            .button {
                border: none;
                color: white;
                padding: 16px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                transition-duration: 0.4s;
                cursor: pointer;
            }
            
            .button1 {
                background-color: white; 
                color: black; 
                border: 2px solid #4CAF50;
            }
            .center {
                text-align: center;
            }
            
            .button1:hover {
                background-color: #4CAF50;
                color: white;
            }
            </style> <!--Quick example to make it look not poor - please modify style for those who have good eye-->

            <script
            src="https://code.jquery.com/jquery-3.4.1.min.js"
            integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
            crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.6/handlebars.min.js" integrity="sha256-usTqAE1ywvdMtksWzdeWzD75MsfJN0h0U7y2NtZL3N0=" crossorigin="anonymous"></script>
            <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/1.0.11/jquery.csv.min.js"></script>
        
            <script>
            window.fbAsyncInit = function() {
        FB.init({
            appId            : '292101951946162',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v8.0'
        });
        };
        </script>

        </head>
        <body>

        <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>
            <script id="createBadge" type="text/x-handlebars-template">
                
            <div class="center">
                <h1>Take a look at this score! Here's the link to start a new quiz: </h1>
                <a class="button button1" href = " ../index.html">Take the Quiz!</a>
            </div>
            
            <div id="score-container">
                <h2 class="score-text">You scored <span id='user-score' class='hl-num'></span> out of <span id='total-ques' class='hl-num'></span>.</h2>
                <h3 class="badge-text">You atually earned df the badge of {{character}}.</h2>
                <div class="score-card">
                    <img class="score-img" src={{url}}>
                    <p class="character-tag">{{character}}</p>
                </div>
                <p class="character-desc">{{description}}</p>
                <button id="share-button">
                    Share
                </button>
                </div>
                
            </script>
        
            <div class="bg-image"></div>
            <div class="content">
                <div id="tracker-section"></div>
                <div id='quiz-content'>
                </div>
            </div>
            <script type="text/javascript" src="generate.js"></script> <!--THIS FILE CAN BE COPY PASTED FOR EACH NEW
            BADGE OR CREATED VIA A SCRIPT. THE META DATA ABOVE MUST BE CHANGED PER SCRIPT, THAT IS THE ONLY REQUIREMENT-->
        </body>
    </html>"""

    return html_string

def create_html_strings(my_badges):
    """ Iterate on all data points and add in 
    data to HTML, then write to file"""

    colNames = my_badges.columns.tolist()
    for idx, badge_nfo in my_badges.iterrows():
        thisChar = badge_nfo[colNames[1]]
        url_img = badge_nfo[colNames[2]]
        desc = badge_nfo[colNames[3]]
        this_html = make_html()
        this_html = this_html % (thisChar, desc, url_img)
        write_file(this_html, thisChar)
    


def write_file(html_string, name):
    """Write html formatted data to html file"""
    
    f = open(name + ".html", 'w')
    f.write(html_string)
    f.close()
    print("Written " + name + " down!")




if __name__ == "__main__":
    print("Auto Generating all HTML Files...")
    my_badges = read_badge_data()
    create_html_strings(my_badges)
    print("Completed generating HTML Files!")
    
    
