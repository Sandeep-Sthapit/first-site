# Information
I've made a couple of changes in my limited time that should help us get what we want with the share.
There are a couple of problems that I faced, which all deal with Facebook's new Privacy laws.
In recent times, their API has become LESS usable, and is less powerful, due to removal of features.
Thus, I found workarounds that let us do what we want, even with these new limitations. 

## Main Limitations
- Facebook made it so that only HARD CODED meta tags (such as the <meta> tags on the top of a page) can be 
loaded by the scraper. You can't, unlike before, pass in those data to the API call, which is what really
caused problems.
- Dynamically changing the meta tags cannot be done in default javascript, and I found a workaround to this
using something called Pre-render.io, but that requires a NODE based architecture (or another server), and 
regular GitHub hostin won't work. The node architecture let's our software fall in with it's middleware, and we then
PAY the actual service to only show our website to the web crawlers (ie facebooks meta crawler) only AFTER
our javscript has finished. The biggest issue with this is that it still requires our page to be 'finished' 
rather rapidly, not at the end of the quiz. However, I noticed our design contains the image being generated 
randomly at first anyways, so this is a viable and easy solution that requires the least change of the code base AFTER
the architecutre is changed (which is a large change, and requires a different hosting service).
- Thus, the main limit is to work via the meta hard code, and still get what we want with some dynamic-ness. It's 
literally 'source code' hard code that the crawler reads, so dynamic 'souce code' cannot be used.

## Solutions
I've provided 3 solutions, and have left code for all of them. Right off the bat, I will say that:
1. I have <b>NOT STYLED</b> things well - I'm not an artist, so while I've proven the concept, please
redesign the buttons and such to be better (or remove them entirely) - with more time, I would have like to
play artist, but you would probably still not like the design (:p).
2. I have created one solution (Solution 3) that does EXACTLY what was requested, but it requires more work (but it's 
already completed and proven for one badge, just copy and paste for the rest while modifying the 
meta tags, which is the biggest restricting factor as we saw above (Main Limitations) - I'm limited on time, otherwise
I would do this myself - I linked a post on the Teacher.html to help create a script that can generate them all at once, which only
needs to be run once (each time a new badge is added) (facebook limitations require such things)).
3. The first solution adds in MORE data, using hashtags, and the 'comment box' and provides the information we want
but doesn't support images - this DOES NOT require much change to this code and get's close to the requirements, adding in
more detail by text but no image.
4. The Facebook Limitations are EXTREMELY sturdy, and that is a result of something that the world has moved into, since
data is so free - this solution is more 'hacky' but still adheres to what they want with constant meta tags in the source.
IFF the architecture changed, solution 2 would make the most sense, but social media API manipulation will continue to get harder
so please consider this when thinking of adding/creating certain designs. Solution 3 is likely the best workaround.

### Solution 1 - Quickest to implement, can mix with Solution 3 - add more details, but no image
This is the solution that I've implemented here. Checking quiz.js, it's just using the generateBadge() function, with the 
new runTemporaryWorkAround() function done onClick in the generateBadge() function. This adds more information to the post 
which more or less get's us near what we want - the length of the post can be changed, so this may be further utilized if 
chosen. This took some time to find, but is a quick, low code change solution.

### Solution 2 (Not fully implemented, requires a change in architecture, if wanting to follow I can share more))
This solution is not yet implemented in full (I have a test example but this won't work with the current setup becaues this 
require Github to host NODE based server - our page is hosted on Github which only works with normal html/javscript file).
Feel free to see if there is some way to do this, but this has a second caveat - afte a hard limit of 250 transactions, this
will also charge monthly.
The solution is based on the concept of "Pre-Rendering". This means to RENDER a HTML page until it's fully loaded via Javascript,
so that the crawlers (which facebook, unfortunately, hasn't made dynamically catching, and loads up the FIRST SOURCE it sees, which
will not contain our data since our meta tags can only change once we LOAD UP the data - it's a dog chasing it's tail type situation and
we can never 'catch it' before it loads the original data to give it the new dynamic data - unless we change our architecture to use
NODE and then host it on a site that allows the NODE server to be hosted, and then add prerender.io middleware to our app, then finally
pay prerender.io to ensure our website is properly 'finished' (done loading) before it shows it to the crawlers).
This again, only works because I notice that the 'score' doesn't map to the 'badge' - it seems this is done randomly. If the badge
could ONLY BE KNOWN after the score, this solution would liekly require more thinking (I'm not sure if it would let users play
on the site, then only after the game is 'done', finally push the page to the crawlers - this is also possible).
This solution would require the MOST change, but allows the MOST dynamic changes to meta tags based on the results of the score (but 
only if the dynamism happens at first - unsure what occurs if it takes time to change dynamically)).
I've written code that should work if prerender is applied (and that code is used). Note that I've made 2 ways to do this, one
to 'add' it in dynamically before to nonexistent meta tags, and another to 'overwrite' existing meta tags. 

### Solution 3 (Likely the best solution, with Number 1, can add Image - yet still requires extra scripting for future ease)
This solution answers EXACTLY what was required, but requires extra work, and this MUST be done (and hopefully can be improved) because
of the way that Facebook crawls data! It requires the creation of a HTML PAGE per EACH BADGE. This ensures that the hardcoded META tags
eixst, and Facebook can scrape it at the beginning with no problem. However, this is still FAIRLY dynamic. There is a new javascript file
that gets data from the original quiz javascript (via sessionStorage, which it clears). If it determines a user clicks the link (ie from
facebook, to this 'score page', it will reroute them to the homepage, thereby getting us what we want (since they don't have a score
yet) - note this may not be required if the 'href' is changed to the final link anyways, but I added this just in case someone goes to this page without a link). For those who DO have a score, it will allow them to share this page with the right message (with all the power of Solution 1
above). Thus, to a user, it will behave very similarly to allowing dynamic pages - the only caveat is that a new HTML page must be 
created for each 'dynamic' badge - but the SINGLE javascript code should be good for all of them (generate.js). This is the only way
I found to get around Facebook's issue, and hopefully can be improved. To use this in full, please copy the single 'Teacher.html', and 
make a HTML for EACH badge (you MUST use their Character.HTML - note, a single script that genrates all the HTML files at once at the 
beginning may make this faster, as they are all duplicaets, with different meta tags to adhere to facebooks limitation.)
For now, to test this works, in quiz.js, ensure that there is no shuffle (just choose Teacher, or the 0th element of that array).
Then, change the generateBadge to the new function I made (generateBadgeSolution3). You will see it work as expected, including
people on facebook clicking the link and it routing them to the homepage instantly.
NOTE - the inner HTML must have PNG images, svg doesn't work with Facebook. Also, if the scraper doesn't pick it up, please 'rescrape'
it manually using Facebook's developer website (only needs to be done once when first loading the meta pages - can be left alone later).
