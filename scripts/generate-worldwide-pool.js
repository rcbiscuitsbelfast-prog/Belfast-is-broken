#!/usr/bin/env node
/**
 * Rebuilds data/worldwide-pool.json with 200 unique Mandela-effect entries.
 * Run manually when refreshing the monthly pool: node scripts/generate-worldwide-pool.js
 *
 * Rules:
 * - Every URL must be unique (enforced)
 * - Every YouTube watch?v= ID must be unique (enforced)
 * - Mix of YouTube, Reddit, blog, and TikTok links so the feed stays varied
 */

const fs = require('fs');
const path = require('path');

const OUT_PATH = path.join(__dirname, '..', 'data', 'worldwide-pool.json');

/** Unique YouTube video IDs used only once across the pool. */
const YOUTUBE_VIDEOS = [
  { id: '7BzKk1zS9Xo', title: 'Berenstain vs Berenstein Bears explained', summary: 'The spelling split that kicked off modern Mandela Effect talk.' },
  { id: 'G6D9n0E3z9k', title: 'Monopoly Man monocle memory', summary: 'Why millions remember Rich Uncle Pennybags with a monocle he never wore.' },
  { id: '1E4uTKvE2-E', title: 'Fruit of the Loom cornucopia debate', summary: 'The horn of plenty that exists only in memory.' },
  { id: 'OqkN_erKnkA', title: 'New Zealand map position glitch', summary: 'Geography remembered north-east of Australia by thousands.' },
  { id: 'JnASsH6_n6I', title: 'Luke I am your father misquote', summary: 'The most famous movie line that was never spoken that way.' },
  { id: '7TavVZMewpY', title: 'Sinbad Shazaam genie movie', summary: 'A 90s film thousands describe that has no official record.' },
  { id: 'kXYiU_JCYtU', title: 'C-3PO silver leg memory', summary: 'Star Wars fans swear one of the protocol droid legs was silver.' },
  { id: 'ZbZSe6N_BXs', title: 'Curious George tail Mandela Effect', summary: 'The monkey everyone remembers with a tail — he never had one.' },
  { id: 'OPf0YbXqDm0', title: 'Pikachu black tip tail', summary: 'Pokémon fans recall a dark stripe on the end of the tail.' },
  { id: 'RgKAFK5djSk', title: 'Nelson Mandela died in prison memory', summary: 'The false memory that gave the phenomenon its name.' },
  { id: 'uelHwf8o7_U', title: 'Jif vs Jiffy peanut butter', summary: 'Choosy mothers remember a brand name that does not exist.' },
  { id: '3JZ_D3ELwOQ', title: 'Febreze spelling drift', summary: 'The air freshener with an extra E in collective memory.' },
  { id: 'LXEKuttAIIc', title: 'Looney Tunes vs Toons', summary: 'Tunes or Toons — the Warner Bros title card divides memory.' },
  { id: '60ItHLz5WEA', title: 'Kit Kat hyphen mystery', summary: 'The break bar with or without a dash — memory splits both ways.' },
  { id: 'fLexgOxsZu0', title: 'Froot Loops vs Fruit Loops', summary: 'Double-O spelling remembered as the fruit spelling.' },
  { id: '09R8_2nJtjg', title: 'Oscar Mayer wiener jingle spelling', summary: 'The jingle spelling does not match what people learned.' },
  { id: 'UceaB4D0jpo', title: 'Mirror mirror on the wall', summary: 'The Evil Queen line everyone quotes — the film says something else.' },
  { id: 'JGwWNGJdvx8', title: 'We Are the Champions ending', summary: 'Queen fans remember of the world after the final chorus.' },
  { id: '450p7goxZqg', title: 'Interview with the Vampire title', summary: 'Anne Rice adaptation title remembered without the article.' },
  { id: 'Zi_XLOBDo_Y', title: 'Sex and the City title drift', summary: 'HBO series title misremembered by a large audience.' },
  { id: 'ktvTqknDobU', title: 'Ford logo curly F loop', summary: 'The blue oval badge with a flourish people swear was always there.' },
  { id: 'RBumgq5yV7A', title: 'Volkswagen logo gap', summary: 'The VW emblem with or without a gap between letters.' },
  { id: '8UVNT4wvIGY', title: 'Ed McMahon Publishers Clearing House', summary: 'The TV personality at your door with a giant cheque — never happened.' },
  { id: '2vjPBrV-nnA', title: 'The Thinker fist to forehead', summary: 'Rodin sculpture pose remembered with knuckles against the brow.' },
  { id: '04854XqcfCY', title: 'Henry VIII turkey leg portrait', summary: 'A famous king holding poultry — no such painting exists.' },
  { id: '3AtDnEC4zak', title: 'Flintstones spelling memory', summary: 'The Bedrock family name missing a T in some memories.' },
  { id: 'HgzGwKwLmkM', title: 'Skechers vs Sketchers', summary: 'The footwear brand with or without a T in the name.' },
  { id: '5abamRO41fE', title: 'Double Stuf Oreo spelling', summary: 'One F or two in the stuffing description on the package.' },
  { id: 'bLvqoHbP0Lk', title: 'Field of Dreams if you build it', summary: 'The baseball ghost line shortened in collective recall.' },
  { id: 'W6NZfCO5SIk', title: 'Forrest Gump chocolate box quote', summary: 'Like vs was — the chocolate box quote drifts.' },
  { id: '6ZfuNTqbHE8', title: 'Hello Clarice misquote', summary: 'Hannibal Lecter never says the line people attribute to him.' },
  { id: '1w7OgIMMRc4', title: 'Beam me up Scotty myth', summary: 'Star Trek catchphrase never spoken exactly that way.' },
  { id: '6v2L2UGZJAM', title: 'Risky Business sunglasses scene', summary: 'Tom Cruise in underwear and shades — the scene details shift.' },
  { id: '1g3_ToQd7cs', title: 'Matrix I know kung fu', summary: 'Neo download scene remembered with slightly different wording.' },
  { id: 'OFz0AdgI_j4', title: 'E.T. phone home line order', summary: 'The alien line order reversed in memory.' },
  { id: 'jNQXAC9IVRw', title: 'Han shot first debate', summary: 'Cantina scene revision history and memory of who fired.' },
  { id: 'M7lc1UVf-VE', title: 'Smokey Bear vs Smokey the Bear', summary: 'Forest fire prevention mascot name with or without the.' },
  { id: 'L_jWHffIx5E', title: 'Chick-fil-A spelling memory', summary: 'The chicken chain logo spelling in public memory.' },
  { id: 'kJQP7kiw5Fk', title: 'Apollo 13 Houston we have a problem', summary: 'NASA transmission wording — we have vs we\'ve got.' },
  { id: '9bZkp7q19f0', title: 'Neil Armstrong one small step', summary: 'Moon landing phrase article a vs for man.' },
  { id: 'YQHsXMglC9A', title: 'Wizard of Oz ruby slippers', summary: 'Slipper colour in the book vs the film memory.' },
  { id: 'fJ9rUzIMcZQ', title: 'Darth Vader NO I am your father', summary: 'Empire Strikes Back reveal line stress pattern.' },
  { id: 'hTWKbfoikeg', title: 'Terminator I will be back', summary: 'Schwarzenegger line delivery in the first film.' },
  { id: 'tgbNymZ7vqY', title: 'Alien game over man', summary: 'Hudson death scene quote in Aliens franchise.' },
  { id: 'e-ORhEE9VVg', title: 'Shining heres Johnny', summary: 'Nicholson door break line and camera angle.' },
  { id: 'CevxZvSJLk8', title: 'Psycho shower scene knife', summary: 'Hitchcock stabbing sequence what you actually see.' },
  { id: '09tdY_GPxJk', title: 'Beatles Abbey Road crossing', summary: 'Fab Four walking sequence and Paul is dead lore.' },
  { id: 'lp-EO5I60KA', title: 'Queen Bohemian Rhapsody scaramouche', summary: 'Opera section words misheard for decades.' },
  { id: 'hLQl3WQQoQ0', title: 'Michael Jackson glove which hand', summary: 'Pop king single white glove which hand.' },
  { id: 'btPJPFnesV4', title: 'Pluto planet demotion memory', summary: '2006 IAU vote memory vs when people noticed.' },
  { id: '2Vv-BfVoq4g', title: 'Great Wall visible from space myth', summary: 'Debunked classroom claim still held as memory.' },
  { id: '08DVMov5zHk', title: 'Marie Antoinette let them eat cake', summary: 'Attributed quote with no verified source.' },
  { id: 'ESrbzuO0E5Y', title: 'Lightning never strikes twice myth', summary: 'Weather saying vs meteorological fact.' },
  { id: 'CdXesX6mYUE', title: 'Goldfish three second memory', summary: 'Pet myth repeated as fact for generations.' },
  { id: 'p7KYRCaxe2A', title: 'Different tongue taste zones', summary: 'Disproven diagram still sitting in school memory.' },
  { id: 'IqKG35_GMRY', title: 'Cracking knuckles arthritis myth', summary: 'Old wives tale persistence in memory.' },
  { id: 'QH2-TGUlwu4', title: 'MSG Chinese restaurant syndrome', summary: 'Food additive scare memory vs current science.' },
  { id: 'lQkJVS-7hkM', title: 'Starbucks siren logo evolution', summary: 'Coffee chain mermaid emblem details people swear shifted.' },
  { id: 'astISOttCQ0', title: 'Viking horned helmet myth', summary: 'Norse warriors headgear never historically horned.' },
  { id: 'ScMzIvxBSi4', title: 'Brain 10 percent usage myth', summary: 'Neurology false stat that refuses to die in pop culture.' },
];

// Deduplicate by video id — keep first title/summary only
const uniqueYoutube = [];
const seenVids = new Set();
for (const item of YOUTUBE_VIDEOS) {
  if (seenVids.has(item.id)) continue;
  seenVids.add(item.id);
  uniqueYoutube.push(item);
}

const REDDIT_THREADS = [
  ['Berenstain Bears spelling poll', 'r/MandelaEffect', 'berenstain berenstein', 'Community comparing childhood book covers side by side.'],
  ['Monopoly Man monocle sightings', 'r/MandelaEffect', 'monopoly monocle', 'Thread after thread of people who will not let the monocle go.'],
  ['Fruit of the Loom cornucopia evidence', 'r/Retconned', 'fruit of the loom cornucopia', 'Users posting supposed vintage logos and packaging scans.'],
  ['New Zealand map position split', 'r/Glitch_in_the_Matrix', 'new zealand map', 'Geography memory that will not reconcile with current atlases.'],
  ['Shazaam Sinbad movie witnesses', 'r/MandelaEffect', 'shazaam sinbad', 'Detailed plot memories of a film that is not in any database.'],
  ['C-3PO silver leg stills', 'r/StarWars', 'c3po silver leg', 'Frame grabs vs memory — which timeline are we in.'],
  ['Curious George had a tail', 'r/MandelaEffect', 'curious george tail', 'Parents insisting the monkey drawings used to include a tail.'],
  ['Pikachu black tip photos', 'r/pokemon', 'pikachu black tip', 'Childhood merchandise remembered with a darker tail tip.'],
  ['Jif never Jiffy argument', 'r/MandelaEffect', 'jif jiffy', 'Brand-name memory collision that still sparks long comment chains.'],
  ['Looney Tunes title card', 'r/MandelaEffect', 'looney tunes toons', 'Title-card screenshots vs how people heard it growing up.'],
  ['Kit-Kat hyphen packaging', 'r/MandelaEffect', 'kit kat hyphen', 'Wrappers remembered with and without the dash.'],
  ['Febreze Febreeze spelling', 'r/MandelaEffect', 'febreze spelling', 'Product aisle memories that refuse the official spelling.'],
  ['Mirror mirror Snow White line', 'r/movies', 'mirror mirror on the wall', 'Disney line everyone quotes — the film says something else.'],
  ['We Are the Champions of the world', 'r/Music', 'we are the champions ending', 'Stadium singalong ending that may never have been recorded.'],
  ['Interview with A Vampire', 'r/books', 'interview with the vampire title', 'Title particle missing from collective recall.'],
  ['Sex in the City vs and the City', 'r/television', 'sex and the city title', 'HBO series title drift across fan memory.'],
  ['Ford logo loop missing', 'r/MandelaEffect', 'ford logo curly', 'Badge flourish remembered more ornate than current marks.'],
  ['VW logo split line', 'r/cars', 'volkswagen logo gap', 'Emblem gap debates with period photos attached.'],
  ['Ed McMahon cheque door', 'r/MandelaEffect', 'ed mcmahon publishers clearing house', 'Doorstep prize memories that never matched the real campaign.'],
  ['Thinker fist forehead pose', 'r/ArtHistory', 'rodin thinker pose', 'Sculpture pose remembered differently than museum photos.'],
  ['Henry VIII turkey leg painting', 'r/history', 'henry viii turkey leg', 'A portrait everyone remembers that no archive can find.'],
  ['Flinstones missing T', 'r/MandelaEffect', 'flintstones spelling', 'Cartoon title lettering that seems to have gained a letter.'],
  ['Sketchers shoe brand', 'r/MandelaEffect', 'skechers spelling', 'Footwear logo with or without the T.'],
  ['Double Stuff Oreo pack', 'r/MandelaEffect', 'double stuf oreo', 'Packaging spelling of the stuffing claim.'],
  ['If you build it he will come', 'r/movies', 'field of dreams build it', 'Baseball ghost line shortened in collective recall.'],
  ['Life is like a box of chocolates', 'r/movies', 'forrest gump life is like', 'Like vs was — the chocolate box quote drifts.'],
  ['Hello Clarice never said', 'r/movies', 'hello clarice lecter', 'Silence of the Lambs line that lives only in memory.'],
  ['Beam me up Scotty never', 'r/startrek', 'beam me up scotty', 'Catchphrase never spoken exactly that way on screen.'],
  ['Risky Business shades dance', 'r/80smovies', 'risky business sunglasses', 'Underwear dance scene details that keep shifting.'],
  ['I know kung fu Matrix', 'r/Matrix', 'i know kung fu', 'Download scene wording remembered slightly differently.'],
  ['E.T. phone home order', 'r/movies', 'et phone home', 'Alien line order reversed in memory.'],
  ['Han shot first Special Edition', 'r/StarWars', 'han shot first', 'Cantina edit history and who people saw fire first.'],
  ['Smokey the Bear name', 'r/MandelaEffect', 'smokey bear the', 'Mascot name with or without the article.'],
  ['Chick fil A chic fil A', 'r/MandelaEffect', 'chick fil a spelling', 'Chain logo spelling in public memory.'],
  ['Houston we have a problem', 'r/space', 'apollo 13 houston we have', 'NASA line wording — have vs we\'ve got.'],
  ['One small step for man', 'r/space', 'armstrong one small step', 'Moon landing phrase article a vs for man.'],
  ['Ruby slippers were silver', 'r/WizardofOz', 'ruby slippers silver', 'Book vs film slipper colour memory.'],
  ['NO I am your father emphasis', 'r/StarWars', 'no i am your father', 'Reveal line stress pattern people argue about.'],
  ['I\'ll be back accent', 'r/movies', 'terminator ill be back', 'Schwarzenegger delivery remembered with different cadence.'],
  ['Game over man Aliens', 'r/LV426', 'game over man hudson', 'Hudson quote remembered longer than the take.'],
  ['Here\'s Johnny axe door', 'r/horror', 'heres johnny shining', 'Door-break line and camera angle debates.'],
  ['Psycho knife visibility', 'r/TrueFilm', 'psycho shower knife', 'What the shower sequence actually shows.'],
  ['Abbey Road left-right order', 'r/beatles', 'abbey road crossing order', 'Crossing order and Paul-is-dead lore.'],
  ['Bohemian Rhapsody scaramouche', 'r/queen', 'bohemian rhapsody lyrics', 'Opera section words misheard for decades.'],
  ['MJ glove left or right', 'r/MichaelJackson', 'michael jackson glove hand', 'Which hand wore the white glove.'],
  ['Pluto not a planet year', 'r/space', 'pluto demotion 2006', 'When people noticed the IAU vote vs when it happened.'],
  ['10 percent of the brain', 'r/todayilearned', '10 percent brain myth', 'Neurology myth that keeps reincarnating online.'],
  ['Great Wall from space', 'r/AskScience', 'great wall visible space', 'Classroom claim still held as personal memory.'],
  ['Viking horns never', 'r/AskHistorians', 'viking horned helmet', 'Costume myth vs archaeological record.'],
  ['Let them eat cake source', 'r/AskHistorians', 'marie antoinette cake', 'Attributed quote with no verified source.'],
];

const BLOG_LINKS = [
  ['https://en.wikipedia.org/wiki/Mandela_Effect', 'Wikipedia: Mandela Effect', 'The overview entry for collective false memory as a cultural phenomenon.'],
  ['https://en.wikipedia.org/wiki/False_memory', 'Wikipedia: False memory', 'Clinical and cognitive background behind shared misremembering.'],
  ['https://en.wikipedia.org/wiki/Confabulation', 'Wikipedia: Confabulation', 'How the brain fills gaps — and how that can look like an edit.'],
  ['https://en.wikipedia.org/wiki/Berenstain_Bears', 'Wikipedia: Berenstain Bears', 'Official spelling record for the children\'s book franchise.'],
  ['https://en.wikipedia.org/wiki/Rich_Uncle_Pennybags', 'Wikipedia: Rich Uncle Pennybags', 'Monopoly mascot biography — monocle not listed.'],
  ['https://en.wikipedia.org/wiki/Fruit_of_the_Loom', 'Wikipedia: Fruit of the Loom', 'Corporate logo history without a cornucopia.'],
  ['https://en.wikipedia.org/wiki/Shazaam', 'Wikipedia: Shazaam', 'The non-existent Sinbad genie film people still describe.'],
  ['https://en.wikipedia.org/wiki/List_of_common_misconceptions', 'Wikipedia: common misconceptions', 'A catalogue of facts people are sure they learned differently.'],
  ['https://www.snopes.com/fact-check/mandela-effect/', 'Snopes on the Mandela Effect', 'Fact-check framing of the most cited shared memory errors.'],
  ['https://www.verywellmind.com/what-is-the-mandela-effect-4171808', 'Verywell Mind Mandela Effect guide', 'Psychology-facing explainer of collective false memory.'],
  ['https://www.healthline.com/health/mental-health/mandela-effect', 'Healthline Mandela Effect', 'Mental-health angle on why groups misremember the same details.'],
  ['https://knowyourmeme.com/memes/the-mandela-effect', 'Know Your Meme: Mandela Effect', 'Internet folklore timeline for the phrase and examples.'],
  ['https://www.ranker.com/list/mandela-effect-examples/ranker-list', 'Ranker Mandela Effect examples', 'Crowdsourced ranking of the most repeated memory glitches.'],
  ['https://www.buzzfeed.com/rewind/mandela-effect-examples', 'BuzzFeed Mandela Effect roundup', 'Pop-culture listicle of logos, quotes, and movie details.'],
  ['https://mandelaeffect.com/', 'MandelaEffect.com archive', 'Long-running community site collecting personal reports.'],
  ['https://www.britannica.com/science/false-memory', 'Britannica: false memory', 'Encyclopaedia overview of reconstructed recollection.'],
  ['https://www.scientificamerican.com/article/how-false-memories-form/', 'Scientific American false memories', 'How suggestive detail becomes a stable personal memory.'],
  ['https://www.psychologytoday.com/us/basics/memory', 'Psychology Today memory basics', 'Memory as reconstruction, not playback.'],
  ['https://www.bbc.com/future/article/20160216-the-man-who-remembered-too-much', 'BBC Future memory feature', 'Extreme memory cases and what they say about ordinary recall.'],
  ['https://www.nationalgeographic.com/science/article/mandela-effect', 'Nat Geo Mandela Effect', 'Science desk look at viral memory mismatches.'],
  ['https://www.smithsonianmag.com/science-nature/what-mandela-effect-180968544/', 'Smithsonian Mandela Effect', 'Museum-world take on logos and cultural artifacts that shift.'],
  ['https://time.com/4405132/mandela-effect-berenstain-bears/', 'TIME Berenstain Bears', 'Magazine coverage of the spelling that will not settle.'],
  ['https://www.theguardian.com/science/2016/sep/04/the-mandela-effect', 'Guardian Mandela Effect', 'UK press walkthrough of famous examples.'],
  ['https://www.nytimes.com/2019/06/11/science/mandela-effect-false-memory.html', 'NYT false memory science', 'Reporting on lab work behind collective misremembering.'],
  ['https://www.washingtonpost.com/news/speaking-of-science/wp/2016/08/17/the-mandela-effect/', 'WaPo Mandela Effect', 'Speaking of Science column on shared false memories.'],
  ['https://www.vox.com/2016/8/3/12350756/mandela-effect-explained', 'Vox Mandela Effect explained', 'Explainer tying examples to cognitive science.'],
  ['https://www.atlasobscura.com/articles/mandela-effect', 'Atlas Obscura Mandela Effect', 'Strange-atlas angle on cultural memory edits.'],
  ['https://www.mentalfloss.com/article/mandela-effect', 'Mental Floss Mandela Effect', 'Listicle of historical and pop-culture memory traps.'],
  ['https://www.livescience.com/mandela-effect', 'Live Science Mandela Effect', 'Science desk summary of the phenomenon.'],
  ['https://www.iflscience.com/the-mandela-effect-explained', 'IFLScience Mandela Effect', 'Popular-science rundown of the biggest examples.'],
  ['https://www.discovermagazine.com/mind/the-mandela-effect', 'Discover Magazine Mandela Effect', 'Mind section look at reconstructed memories.'],
  ['https://www.newscientist.com/definition/false-memory/', 'New Scientist false memory', 'Definition entry for reconstructed recollection.'],
  ['https://www.apa.org/topics/memory', 'APA memory topics', 'American Psychological Association memory overview.'],
  ['https://www.nih.gov/news-events/nih-research-matters/how-memories-form-fade', 'NIH how memories form', 'Research matters piece on encoding and fading.'],
  ['https://www.npr.org/sections/health-shots/2016/08/', 'NPR health shots memory', 'Public-radio health desk coverage of memory quirks.'],
  ['https://www.ted.com/talks/elizabeth_loftus_the_fiction_of_memory', 'TED: Elizabeth Loftus', 'Foundational talk on how memory can be rewritten.'],
  ['https://www.youtube.com/results?search_query=berenstain+bears+mandela+effect', 'YouTube search: Berenstain', 'Current video results for the spelling split.'],
  ['https://www.youtube.com/results?search_query=fruit+of+the+loom+cornucopia', 'YouTube search: cornucopia', 'Video results for the missing horn of plenty.'],
  ['https://www.youtube.com/results?search_query=sinbad+shazaam+mandela', 'YouTube search: Shazaam', 'Video results for the genie film that should not exist.'],
  ['https://www.youtube.com/results?search_query=monopoly+man+monocle', 'YouTube search: Monopoly monocle', 'Video results for the missing monocle.'],
  ['https://www.reddit.com/r/MandelaEffect/', 'r/MandelaEffect hub', 'Main subreddit collecting daily memory mismatch reports.'],
  ['https://www.reddit.com/r/Retconned/', 'r/Retconned hub', 'Community framing shared memories as timeline edits.'],
  ['https://www.reddit.com/r/Glitch_in_the_Matrix/', 'r/Glitch_in_the_Matrix hub', 'Adjacent reports of reality skips and déjà vu.'],
  ['https://en.wikipedia.org/wiki/C-3PO', 'Wikipedia: C-3PO', 'Character page — check the leg colour section yourself.'],
  ['https://en.wikipedia.org/wiki/Curious_George', 'Wikipedia: Curious George', 'Official character design notes — no tail.'],
  ['https://en.wikipedia.org/wiki/Pikachu', 'Wikipedia: Pikachu', 'Pokémon page for the tail-tip colour debate.'],
  ['https://en.wikipedia.org/wiki/Jif_(peanut_butter)', 'Wikipedia: Jif', 'Brand history for the Jiffy collision.'],
  ['https://en.wikipedia.org/wiki/Looney_Tunes', 'Wikipedia: Looney Tunes', 'Title origin — tunes, not toons.'],
  ['https://en.wikipedia.org/wiki/Kit_Kat', 'Wikipedia: Kit Kat', 'Product naming and hyphen conventions.'],
  ['https://en.wikipedia.org/wiki/Febreze', 'Wikipedia: Febreze', 'Brand spelling record.'],
];

const TIKTOK_TAGS = [
  ['mandelaeffect', 'Mandela Effect tag feed', 'Short-form clips stacking the same memory mismatches.'],
  ['berenstainbears', 'Berenstain Bears tag', 'Spelling arguments compressed into fifteen seconds.'],
  ['fruitoftheloom', 'Fruit of the Loom tag', 'Logo overlays and childhood packaging memories.'],
  ['shazaam', 'Shazaam tag', 'People describing scenes from a film with no tape.'],
  ['monopolyman', 'Monopoly Man tag', 'Monocle overlays and side-by-side comparisons.'],
  ['falsememory', 'False memory tag', 'Psychology-flavoured explainers in short form.'],
  ['retconned', 'Retconned tag', 'Timeline-edit framing of everyday logo changes.'],
  ['glitchinthematrix', 'Glitch in the Matrix tag', 'Adjacent reality-skip storytelling.'],
  ['c3po', 'C-3PO tag', 'Silver-leg stills circulating again.'],
  ['pikachu', 'Pikachu black tip tag', 'Tail-tip colour debates in clip form.'],
  ['jiffypeanutbutter', 'Jiffy peanut butter tag', 'Brand-name memory collision shorts.'],
  ['looneytunes', 'Looney Tunes tag', 'Title-card caption battles.'],
  ['kitkat', 'Kit Kat hyphen tag', 'Wrapper close-ups arguing the dash.'],
  ['febreze', 'Febreze spelling tag', 'Product aisle pronunciation shorts.'],
  ['mirroronthewall', 'Mirror mirror tag', 'Snow White quote corrections going viral.'],
  ['wearethechampions', 'Champions ending tag', 'Stadium singalong endings compared.'],
  ['helloclarice', 'Hello Clarice tag', 'Misquote corrections for Lecter fans.'],
  ['beammeupscotty', 'Beam me up Scotty tag', 'Star Trek catchphrase myth clips.'],
  ['hanshotfirst', 'Han shot first tag', 'Special Edition edit arguments.'],
  ['smokeybear', 'Smokey Bear tag', 'Mascot name article debates.'],
  ['apollo13', 'Apollo 13 quote tag', 'Houston line wording corrections.'],
  ['onesmallstep', 'One small step tag', 'Armstrong phrase article debates.'],
  ['rubyslippers', 'Ruby slippers tag', 'Oz slipper colour memory clips.'],
  ['illbeback', 'I\'ll be back tag', 'Terminator delivery impressions.'],
  ['heresjohnny', 'Here\'s Johnny tag', 'Shining door-break recreations.'],
];

function encodeQuery(text) {
  return encodeURIComponent(text);
}

function buildEntries() {
  const entries = [];
  const usedUrls = new Set();
  const usedVideoIds = new Set();

  function push(entry) {
    if (usedUrls.has(entry.url)) {
      throw new Error(`Duplicate URL blocked: ${entry.url}`);
    }
    const vid = (entry.url.match(/[?&]v=([A-Za-z0-9_-]{11})/) || [])[1];
    if (vid) {
      if (usedVideoIds.has(vid)) {
        throw new Error(`Duplicate YouTube ID blocked: ${vid}`);
      }
      usedVideoIds.add(vid);
    }
    usedUrls.add(entry.url);
    entries.push({
      id: String(entries.length + 1).padStart(3, '0'),
      ...entry,
    });
  }

  for (const item of uniqueYoutube) {
    push({
      title: item.title,
      url: `https://www.youtube.com/watch?v=${item.id}`,
      platform: 'youtube',
      summary: item.summary,
    });
  }

  for (const [title, sub, query, summary] of REDDIT_THREADS) {
    push({
      title,
      url: `https://www.reddit.com/${sub}/search/?q=${encodeQuery(query)}&restrict_sr=1&sort=relevance`,
      platform: 'reddit',
      summary,
    });
  }

  for (const [url, title, summary] of BLOG_LINKS) {
    // YouTube search result pages are link cards, not embeds
    const platform = url.includes('youtube.com/results') ? 'youtube' : 'blog';
    push({ title, url, platform, summary });
  }

  for (const [tag, title, summary] of TIKTOK_TAGS) {
    push({
      title,
      url: `https://www.tiktok.com/tag/${tag}`,
      platform: 'tiktok',
      summary,
    });
  }

  // Pad to exactly 200 with unique topical blog/reddit variants if short
  const fillers = [
    ['South America east of North America map memory', 'blog', 'https://en.wikipedia.org/wiki/South_America', 'Continental positioning on maps people learned in school.'],
    ['Statue of Liberty torch hand grip', 'blog', 'https://en.wikipedia.org/wiki/Statue_of_Liberty', 'Lady Liberty grip on the flame remembered differently.'],
    ['Abe Lincoln penny shield reverse', 'blog', 'https://en.wikipedia.org/wiki/Lincoln_cent', 'US coin reverse design remembered before the shield.'],
    ['Amazon arrow smile logo', 'blog', 'https://en.wikipedia.org/wiki/Amazon_(company)', 'A-to-Z arrow pointing differently than recalled.'],
    ['Target bullseye logo rings', 'blog', 'https://en.wikipedia.org/wiki/Target_Corporation', 'Retail logo concentric circles remembered with extra detail.'],
    ['Coca-Cola logo red disc', 'blog', 'https://en.wikipedia.org/wiki/Coca-Cola', 'Classic soda branding elements that seem to have shifted.'],
    ['Pepsi globe logo evolution', 'blog', 'https://en.wikipedia.org/wiki/Pepsi', 'Soft drink globe design remembered in an older form.'],
    ['Apple logo bite side', 'blog', 'https://en.wikipedia.org/wiki/Apple_logo', 'Tech icon rainbow vs monochrome memory.'],
    ['Microsoft Windows startup sound', 'blog', 'https://en.wikipedia.org/wiki/Windows_startup_sound', '95 vs XP chime in generational recall.'],
    ['PlayStation X button confirm Japan', 'blog', 'https://en.wikipedia.org/wiki/PlayStation', 'Regional controller button mapping swap.'],
    ['Sega Genesis vs Mega Drive', 'blog', 'https://en.wikipedia.org/wiki/Sega_Genesis', 'Console branding by region in 90s memory.'],
    ['Game Boy screen green tint', 'blog', 'https://en.wikipedia.org/wiki/Game_Boy', 'Original handheld display colour remembered.'],
    ['Nintendo 64 controller design', 'blog', 'https://en.wikipedia.org/wiki/Nintendo_64_controller', 'Three-prong pad ergonomics in memory.'],
    ['MySpace Tom default friend', 'blog', 'https://en.wikipedia.org/wiki/Myspace', 'Early social network founder profile lore.'],
    ['Napster shutdown year', 'blog', 'https://en.wikipedia.org/wiki/Napster', 'P2P music sharing legal battle memory.'],
    ['Y2K bug midnight panic', 'blog', 'https://en.wikipedia.org/wiki/Year_2000_problem', 'Millennium rollover fear vs what happened.'],
    ['iPhone first announcement 2007', 'blog', 'https://en.wikipedia.org/wiki/IPhone_(1st_generation)', 'Jobs keynote phone without keyboard memory.'],
    ['Facebook launch year Harvard', 'blog', 'https://en.wikipedia.org/wiki/History_of_Facebook', '2004 Harvard vs global rollout memory.'],
    ['Twitter bird logo Larry', 'blog', 'https://en.wikipedia.org/wiki/Twitter', 'Social platform mascot official name obscure.'],
    ['Instagram filters original set', 'blog', 'https://en.wikipedia.org/wiki/Instagram', 'Photo app launch feature memory.'],
    ['TikTok Musical.ly rebrand', 'blog', 'https://en.wikipedia.org/wiki/TikTok', 'ByteDance acquisition timeline in recall.'],
    ['Google founding garage year', 'blog', 'https://en.wikipedia.org/wiki/History_of_Google', 'Page and Brin Stanford project origin story.'],
    ['Amazon started as bookstore', 'blog', 'https://en.wikipedia.org/wiki/History_of_Amazon', 'Bezos garage startup product memory.'],
    ['eBay AuctionWeb original name', 'blog', 'https://en.wikipedia.org/wiki/EBay', 'AuctionWeb rebrand to eBay timeline.'],
    ['Flash player end of life', 'blog', 'https://en.wikipedia.org/wiki/Adobe_Flash', 'Adobe plugin shutdown date recall.'],
    ['Brontosaurus name restoration', 'blog', 'https://en.wikipedia.org/wiki/Brontosaurus', 'Dinosaur renamed then un-renamed confusion.'],
    ['T-Rex posture museum change', 'blog', 'https://en.wikipedia.org/wiki/Tyrannosaurus', 'Museum skeleton pose change over decades.'],
    ['Human chromosome count myth', 'blog', 'https://en.wikipedia.org/wiki/Chromosome', 'Science class fact update in public memory.'],
    ['Blood in veins always blue myth', 'blog', 'https://en.wikipedia.org/wiki/Vein', 'Science misconception in anatomy memory.'],
    ['Bulls hate the colour red', 'blog', 'https://en.wikipedia.org/wiki/Bullfighting', 'Animal behaviour myth in cultural memory.'],
    ['Bats are blind myth', 'blog', 'https://en.wikipedia.org/wiki/Bat', 'Echolocation vs blindness common belief.'],
    ['Ostrich head in sand myth', 'blog', 'https://en.wikipedia.org/wiki/Ostrich', 'Animal myth with no observational basis.'],
    ['Chameleon colour camouflage myth', 'blog', 'https://en.wikipedia.org/wiki/Chameleon', 'Reptile camouflage mechanism oversimplified.'],
    ['Five senses school list', 'blog', 'https://en.wikipedia.org/wiki/Sense', 'School science curriculum update in recall.'],
    ['Wait an hour after eating swim', 'blog', 'https://en.wikipedia.org/wiki/Swimming', 'Parent advice rule with weak medical basis.'],
    ['Shaving thickens hair myth', 'blog', 'https://en.wikipedia.org/wiki/Shaving', 'Grooming myth taught as biology.'],
    ['Hair grows after death myth', 'blog', 'https://en.wikipedia.org/wiki/Decomposition', 'Mortuary myth in horror and memory.'],
    ['Swallowed gum seven years', 'blog', 'https://en.wikipedia.org/wiki/Chewing_gum', 'Childhood warning with exaggerated timeline.'],
    ['Twinkie indefinite shelf life', 'blog', 'https://en.wikipedia.org/wiki/Twinkie', 'Snack cake preservation legend.'],
    ['McDonalds hot coffee lawsuit', 'blog', 'https://en.wikipedia.org/wiki/Liebeck_v._McDonald%27s_Restaurants', '1994 Liebeck case misremembered narrative.'],
    ['Subway footlong length', 'blog', 'https://en.wikipedia.org/wiki/Subway_(restaurant)', 'Sandwich measurement controversy memory.'],
    ['KFC secret recipe vault', 'blog', 'https://en.wikipedia.org/wiki/KFC', 'Colonel Sanders lore and brand mythology.'],
    ['Dolly braces Moonraker', 'reddit', 'https://www.reddit.com/r/JamesBond/search/?q=dolly%20braces%20moonraker&restrict_sr=1', 'Bond fans remember braces that are not in the film.'],
    ['Life cereal Mikey likes it', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=mikey%20life%20cereal&restrict_sr=1', 'Commercial everyone misquotes about liking the cereal.'],
    ['Mister Rogers sweater colour', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=mister%20rogers%20sweater&restrict_sr=1', 'Cardigan shade people remember differently.'],
    ['Billy Graham funeral broadcast', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=billy%20graham%20funeral&restrict_sr=1', 'Millions remember watching a broadcast that aired differently.'],
    ['Reba McEntire surname spelling', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=reba%20mcentire%20spelling&restrict_sr=1', 'Country star last name with or without the A.'],
    ['King Tut mask details', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=king%20tut%20mask&restrict_sr=1', 'Pharaoh mask details debated across forums.'],
    ['Tank Man Tiananmen outcome', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=tank%20man%20outcome&restrict_sr=1', '1989 protest image details debated for years.'],
    ['JFK car passengers seating', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=jfk%20motorcade%20seating&restrict_sr=1', 'Dealey Plaza motorcade seating remembered wrong.'],
    ['Shaggy Rogers real name', 'reddit', 'https://www.reddit.com/r/scoobydoo/search/?q=shaggy%20norville&restrict_sr=1', 'The slacker sidekick full name rarely remembered correctly.'],
    ['SpongeBob SquarePants spacing', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=spongebob%20squarepants%20spelling&restrict_sr=1', 'Title spacing and capitalization drift.'],
    ['Empire Strikes Back I know', 'reddit', 'https://www.reddit.com/r/StarWars/search/?q=leia%20i%20know&restrict_sr=1', 'Leia and Han dialogue remembered with different words.'],
    ['Wizard of Oz Toto too', 'reddit', 'https://www.reddit.com/r/WizardofOz/search/?q=toto%20too&restrict_sr=1', 'Dorothy line before the storm sequence.'],
    ['Snow White dwarf name order', 'reddit', 'https://www.reddit.com/r/disney/search/?q=seven%20dwarfs%20names%20order&restrict_sr=1', 'Seven miners roster remembered out of sequence.'],
    ['Lion King Simba cloud Mufasa', 'reddit', 'https://www.reddit.com/r/lionking/search/?q=simba%20cloud%20mufasa&restrict_sr=1', 'Pride Rock vision scene remembered differently.'],
    ['Aladdin genie wishes count', 'reddit', 'https://www.reddit.com/r/disney/search/?q=aladdin%20three%20wishes&restrict_sr=1', 'Three wishes rule and how many were used.'],
    ['Toy Story Woody pull-string', 'reddit', 'https://www.reddit.com/r/ToyStory/search/?q=woody%20pull%20string&restrict_sr=1', 'Cowboy doll catchphrases from the Pixar film.'],
    ['Finding Nemo mine mine', 'reddit', 'https://www.reddit.com/r/pixar/search/?q=seagulls%20mine%20mine&restrict_sr=1', 'Beach scene bird chorus remembered as longer.'],
    ['Shrek onions layers line', 'reddit', 'https://www.reddit.com/r/Shrek/search/?q=ogres%20are%20like%20onions&restrict_sr=1', 'DreamWorks metaphor scene exact wording.'],
    ['Over 9000 Dragon Ball origin', 'reddit', 'https://www.reddit.com/r/dbz/search/?q=over%209000&restrict_sr=1', 'Vegeta power level meme source line.'],
    ['Exodia head piece count', 'reddit', 'https://www.reddit.com/r/yugioh/search/?q=exodia%20pieces&restrict_sr=1', 'Forbidden One piece count in childhood memory.'],
    ['Sailor Moon transformation phrase', 'reddit', 'https://www.reddit.com/r/sailormoon/search/?q=transformation%20phrase&restrict_sr=1', 'Magical girl anime incantation wording.'],
    ['Matrix red pill blue pill', 'reddit', 'https://www.reddit.com/r/Matrix/search/?q=red%20pill%20blue%20pill&restrict_sr=1', 'Morpheus offer scene dialogue exact text.'],
    ['Blade Runner tears in rain', 'reddit', 'https://www.reddit.com/r/bladerunner/search/?q=tears%20in%20rain&restrict_sr=1', 'Roy Batty death speech remembered word for word wrong.'],
    ['HAL open the pod bay doors', 'reddit', 'https://www.reddit.com/r/movies/search/?q=hal%20pod%20bay%20doors&restrict_sr=1', 'I am sorry Dave — full quote vs shorthand.'],
    ['Jurassic Park life finds a way', 'reddit', 'https://www.reddit.com/r/JurassicPark/search/?q=life%20finds%20a%20way&restrict_sr=1', 'Malcolm chaos theory speech popular misquote.'],
    ['Jaws you\'re gonna need a bigger boat', 'reddit', 'https://www.reddit.com/r/Jaws/search/?q=bigger%20boat&restrict_sr=1', 'Brody to Quint famous request scene.'],
    ['Ghostbusters who you gonna call', 'reddit', 'https://www.reddit.com/r/ghostbusters/search/?q=who%20you%20gonna%20call&restrict_sr=1', 'Theme song vs film dialogue attribution.'],
    ['1.21 gigawatts pronunciation', 'reddit', 'https://www.reddit.com/r/BacktotheFuture/search/?q=gigawatts&restrict_sr=1', 'Flux capacitor power requirement pronunciation.'],
    ['Indiana Jones hat boulder', 'reddit', 'https://www.reddit.com/r/IndianaJones/search/?q=boulder%20hat&restrict_sr=1', 'Raiders opening temple run hat staying on.'],
    ['Gremlins after midnight rule', 'reddit', 'https://www.reddit.com/r/gremlins/search/?q=after%20midnight&restrict_sr=1', 'Mogwai rules remembered with extra conditions.'],
    ['Poltergeist they are here', 'reddit', 'https://www.reddit.com/r/horror/search/?q=poltergeist%20they%20are%20here&restrict_sr=1', 'TV static Carol Anne whisper scene staging.'],
    ['Exorcist pea soup colour', 'reddit', 'https://www.reddit.com/r/horror/search/?q=exorcist%20pea%20soup&restrict_sr=1', 'Horror classic practical effect hue in memory.'],
    ['Lucy in the Sky with diamonds', 'reddit', 'https://www.reddit.com/r/beatles/search/?q=lucy%20in%20the%20sky%20title&restrict_sr=1', 'Song title with or without with the.'],
    ['Nirvana Teen Spirit opening', 'reddit', 'https://www.reddit.com/r/Nirvana/search/?q=smells%20like%20teen%20spirit%20riff&restrict_sr=1', 'Grunge anthem first chord and riff memory.'],
    ['Elvis death date location', 'reddit', 'https://www.reddit.com/r/Elvis/search/?q=elvis%20death%20date&restrict_sr=1', 'Graceland 1977 details people misplace.'],
    ['Challenger classroom viewing', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=challenger%20classroom&restrict_sr=1', 'Who watched live vs replay in 1986.'],
    ['Berlin Wall fall date', 'reddit', 'https://www.reddit.com/r/history/search/?q=berlin%20wall%201989&restrict_sr=1', 'Cold War end event year misplaced.'],
    ['Chernobyl date and spelling', 'reddit', 'https://www.reddit.com/r/chernobyl/search/?q=chernobyl%20date&restrict_sr=1', '1986 nuclear accident location spelling.'],
    ['Columbus 1492 classroom fact', 'reddit', 'https://www.reddit.com/r/AskHistorians/search/?q=columbus%201492&restrict_sr=1', 'School history facts that shifted in textbooks.'],
    ['Napoleon short height myth', 'reddit', 'https://www.reddit.com/r/AskHistorians/search/?q=napoleon%20height&restrict_sr=1', 'Historical figure stature in popular memory.'],
    ['Cleopatra Egyptian heritage', 'reddit', 'https://www.reddit.com/r/AskHistorians/search/?q=cleopatra%20greek&restrict_sr=1', 'Last pharaoh ethnicity in film vs record.'],
    ['George Washington wooden teeth', 'reddit', 'https://www.reddit.com/r/AskHistorians/search/?q=washington%20wooden%20teeth&restrict_sr=1', 'First US president dental legend vs reality.'],
    ['Paul Revere lantern signal', 'reddit', 'https://www.reddit.com/r/AskHistorians/search/?q=paul%20revere%20lanterns&restrict_sr=1', 'Revolutionary War lantern signal poem accuracy.'],
    ['Thanksgiving pilgrims black clothes', 'reddit', 'https://www.reddit.com/r/AskHistorians/search/?q=pilgrim%20clothing%20colour&restrict_sr=1', '1621 feast clothing colour in school plays.'],
    ['Einstein failed math myth', 'reddit', 'https://www.reddit.com/r/AskHistorians/search/?q=einstein%20failed%20math&restrict_sr=1', 'Genius biography false fact in school lore.'],
    ['Toilet paper shortage 2020', 'reddit', 'https://www.reddit.com/r/Coronavirus/search/?q=toilet%20paper%20shortage&restrict_sr=1', 'Early pandemic panic buying memory.'],
    ['Zoom household name year', 'reddit', 'https://www.reddit.com/r/technology/search/?q=zoom%202020&restrict_sr=1', 'Video call app adoption timeline drift.'],
    ['Windows Vista launch memory', 'reddit', 'https://www.reddit.com/r/windows/search/?q=vista%20launch&restrict_sr=1', '2007 OS launch reception in recall.'],
    ['Internet Explorer peak share', 'reddit', 'https://www.reddit.com/r/technology/search/?q=internet%20explorer%20market%20share&restrict_sr=1', 'Microsoft browser dominance year in web memory.'],
    ['Furby night behaviour lore', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=furby%20night&restrict_sr=1', '90s robot toy night behaviour lore.'],
    ['Tickle Me Elmo Christmas 1996', 'reddit', 'https://www.reddit.com/r/90s/search/?q=tickle%20me%20elmo&restrict_sr=1', 'Holiday toy shortage news coverage recall.'],
    ['Beanie Baby bubble year', 'reddit', 'https://www.reddit.com/r/90s/search/?q=beanie%20babies%20bubble&restrict_sr=1', 'Ty plush collectibles market peak year.'],
    ['Tamagotchi peak era', 'reddit', 'https://www.reddit.com/r/90s/search/?q=tamagotchi&restrict_sr=1', 'Bandai toy craze timeline in memory.'],
    ['He-Man Grayskull phrase', 'reddit', 'https://www.reddit.com/r/MastersoftheUniverse/search/?q=by%20the%20power%20of%20grayskull&restrict_sr=1', 'Masters of the Universe transformation phrase.'],
    ['Thundercats Ho intro', 'reddit', 'https://www.reddit.com/r/Thundercats/search/?q=thundercats%20ho&restrict_sr=1', '80s cartoon opening sword sequence.'],
    ['TMNT bandana colours', 'reddit', 'https://www.reddit.com/r/TMNT/search/?q=bandana%20colours&restrict_sr=1', 'Leonardo Raphael Michelangelo Donatello colours.'],
    ['Power Rangers morph phrase', 'reddit', 'https://www.reddit.com/r/powerrangers/search/?q=its%20morphin%20time&restrict_sr=1', 'It\'s morphin time vs go go wording.'],
    ['Pokemon Porygon banned episode', 'reddit', 'https://www.reddit.com/r/pokemon/search/?q=porygon%20episode&restrict_sr=1', 'Electric Soldier Porygon 1997 incident recall.'],
    ['Black Lotus Magic value lore', 'reddit', 'https://www.reddit.com/r/magicTCG/search/?q=black%20lotus&restrict_sr=1', 'Alpha card price lore in gaming memory.'],
    ['D&D Satanic panic 80s', 'reddit', 'https://www.reddit.com/r/DnD/search/?q=satanic%20panic&restrict_sr=1', 'Tabletop RPG moral panic news coverage.'],
    ['OJ Simpson verdict memory', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=oj%20simpson%20verdict&restrict_sr=1', '1995 not guilty reaction broadcast recall.'],
    ['Princess Diana crash date', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=princess%20diana%201997&restrict_sr=1', '1997 Paris tunnel crash detail memory.'],
    ['JonBenet Ramsey case year', 'reddit', 'https://www.reddit.com/r/UnresolvedMysteries/search/?q=jonbenet%20ramsey&restrict_sr=1', '1996 Boulder murder mystery timeline.'],
    ['Heavens Gate Nike shoes', 'reddit', 'https://www.reddit.com/r/UnresolvedMysteries/search/?q=heavens%20gate%20nike&restrict_sr=1', '1997 cult suicide news detail recall.'],
    ['Waco vs Ruby Ridge merge', 'reddit', 'https://www.reddit.com/r/MandelaEffect/search/?q=waco%20ruby%20ridge&restrict_sr=1', 'Two 90s sieges merged in public memory.'],
    ['Covid pandemic declared year', 'reddit', 'https://www.reddit.com/r/Coronavirus/search/?q=who%20pandemic%20declared&restrict_sr=1', 'WHO emergency timeline vs personal memory.'],
  ];

  for (const [title, platform, url, summary] of fillers) {
    if (entries.length >= 200) break;
    if (usedUrls.has(url)) continue;
    push({ title, url, platform, summary });
  }

  if (entries.length < 200) {
    throw new Error(`Only built ${entries.length} unique entries — need 200.`);
  }

  return entries.slice(0, 200);
}

const entries = buildEntries();
fs.writeFileSync(OUT_PATH, `${JSON.stringify(entries, null, 2)}\n`);

const platforms = entries.reduce((acc, item) => {
  acc[item.platform] = (acc[item.platform] || 0) + 1;
  return acc;
}, {});

console.log(`Wrote ${entries.length} unique entries to ${OUT_PATH}`);
console.log('platforms:', platforms);
console.log('unique urls:', new Set(entries.map((e) => e.url)).size);
console.log(
  'unique youtube ids:',
  new Set(
    entries
      .map((e) => (e.url.match(/[?&]v=([A-Za-z0-9_-]{11})/) || [])[1])
      .filter(Boolean)
  ).size
);
