(function () {
  "use strict";

  var REALITIES = {
    archive: {
      id: "archive",
      label: "BELFAST IS BROKEN",
      title: "BELFAST IS BROKEN | Mandela Effect, Belfast anomalies, paranormal investigations",
      description: "A documented archive of Belfast anomalies, memory drift, Mandela Effect reports, and strange local infrastructure.",
      bodyClass: "reality-archive"
    },
    infrastructure: {
      id: "infrastructure",
      label: "BELFAST IS BROKEN // CIVIC FIX",
      title: "Belfast Is Broken | Civic repair and infrastructure reports",
      description: "A community-maintained Belfast infrastructure monitor for potholes, broken streetlights, drainage faults, damaged pavements, and public repair reports.",
      bodyClass: "reality-infrastructure"
    },
    watchrepair: {
      id: "watchrepair",
      label: "BELFAST WATCH WORKS",
      title: "Belfast Watch Works | Repairs, servicing and restoration",
      description: "Independent Belfast watch repair, servicing and restoration. Mechanical watches, quartz batteries, straps, crystals and careful local work.",
      bodyClass: "reality-watchrepair"
    }
  };

  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (page === "belfast-" || page === "") page = "index.html";
  var requested = new URLSearchParams(location.search).get("reality");
  var realityId = REALITIES[requested] ? requested : null;
  var sessionReality = null;
  if (!realityId) {
    try { sessionReality = sessionStorage.getItem("bib_reality"); } catch (error) {}
    realityId = REALITIES[sessionReality] ? sessionReality : chooseRealityForVisit();
  }
  try { sessionStorage.setItem("bib_reality", realityId); } catch (error) {}
  var reality = REALITIES[realityId];

  document.documentElement.dataset.reality = reality.id;
  document.body.classList.add(reality.bodyClass);
  document.body.dataset.reality = reality.id;
  document.title = reality.title;
  addRealitySwitcher();

  function chooseRealityForVisit() {
    var visits = 1;
    try {
      visits = parseInt(localStorage.getItem("bib_reality_visits") || "0", 10) + 1;
      localStorage.setItem("bib_reality_visits", String(visits));
    } catch (error) {}
    var hour = new Date().getHours();
    if (hour >= 7 && hour < 14) return "infrastructure";
    if (hour >= 14 && hour < 21) return "watchrepair";
    return visits % 3 === 0 ? "archive" : (visits % 2 === 0 ? "watchrepair" : "infrastructure");
  }

  function addRealitySwitcher() {
    var switcher = document.createElement("nav");
    switcher.className = "reality-switcher";
    switcher.setAttribute("aria-label", "Reality switcher");
    switcher.innerHTML = '<span class="reality-switcher-label">record:</span>' +
      '<a href="' + page + '?reality=archive" aria-label="Open archive reality">1</a>' +
      '<a href="' + page + '?reality=infrastructure" aria-label="Open infrastructure reality">2</a>' +
      '<a href="' + page + '?reality=watchrepair" aria-label="Open watch repair reality">3</a>';
    document.body.appendChild(switcher);
  }

  setTimeout(function () {
    if (reality.id === "infrastructure") {
      renderInfrastructure();
      updateInfrastructureMetadata();
    }
    if (reality.id === "watchrepair") {
      renderWatchRepair();
      updateWatchRepairMetadata();
    }
  }, 0);

  function updateInfrastructureMetadata() {
    var baseUrl = "https://rcbiscuitsbelfast-prog.github.io/Belfast-/";
    var variantUrl = baseUrl + page + "?reality=infrastructure";
    var civicImage = baseUrl + "assets/images/flickr-landmarks/52070221303_49fea7cafe_m.jpg";
    var description = document.querySelector('meta[name="description"]');
    var title = document.querySelector('meta[name="title"]');
    var ogTitle = document.querySelector('meta[property="og:title"]');
    var ogDescription = document.querySelector('meta[property="og:description"]');
    var twitterTitle = document.querySelector('meta[name="twitter:title"]');
    var twitterDescription = document.querySelector('meta[name="twitter:description"]');
    var ogUrl = document.querySelector('meta[property="og:url"]');
    var canonical = document.querySelector('link[rel="canonical"]');
    var ogImage = document.querySelector('meta[property="og:image"]');
    var twitterImage = document.querySelector('meta[name="twitter:image"]');
    var values = [description, title, ogTitle, ogDescription, twitterTitle, twitterDescription];
    values.forEach(function (element) {
      if (!element) return;
      var isDescription = element.getAttribute("name") === "description" || element.getAttribute("property") === "og:description" || element.getAttribute("name") === "twitter:description";
      element.setAttribute("content", isDescription ? reality.description : reality.title);
    });
    if (ogUrl) ogUrl.setAttribute("content", variantUrl);
    if (canonical) canonical.setAttribute("href", variantUrl);
    if (ogImage) ogImage.setAttribute("content", civicImage);
    if (twitterImage) twitterImage.setAttribute("content", civicImage);
  }

  function updateWatchRepairMetadata() {
    var baseUrl = "https://rcbiscuitsbelfast-prog.github.io/Belfast-/";
    var variantUrl = baseUrl + page + "?reality=watchrepair";
    var watchImage = baseUrl + "assets/images/flickr-landmarks/55055249236_fc6b13ef22_m.jpg";
    var description = document.querySelector('meta[name="description"]');
    var title = document.querySelector('meta[name="title"]');
    var ogTitle = document.querySelector('meta[property="og:title"]');
    var ogDescription = document.querySelector('meta[property="og:description"]');
    var twitterTitle = document.querySelector('meta[name="twitter:title"]');
    var twitterDescription = document.querySelector('meta[name="twitter:description"]');
    [description, title, ogTitle, ogDescription, twitterTitle, twitterDescription].forEach(function (element) {
      if (!element) return;
      var isDescription = element.getAttribute("name") === "description" || element.getAttribute("property") === "og:description" || element.getAttribute("name") === "twitter:description";
      element.setAttribute("content", isDescription ? reality.description : reality.title);
    });
    var ogUrl = document.querySelector('meta[property="og:url"]');
    var canonical = document.querySelector('link[rel="canonical"]');
    var ogImage = document.querySelector('meta[property="og:image"]');
    var twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (ogUrl) ogUrl.setAttribute("content", variantUrl);
    if (canonical) canonical.setAttribute("href", variantUrl);
    if (ogImage) ogImage.setAttribute("content", watchImage);
    if (twitterImage) twitterImage.setAttribute("content", watchImage);
  }

  function renderInfrastructure() {
    var main = document.querySelector("main.wrap");
    if (!main) return;

    var current = page.replace(".html", "");
    var nav = [
      ["index.html", "DASHBOARD", "index"],
      ["anomalies.html", "REPORTS", "anomalies"],
      ["worldwide.html", "AREA MAP", "worldwide"],
      ["blog.html", "FIELD NOTES", "blog"],
      ["contact.html", "REPORT A FAULT", "contact"]
    ];
    var navMarkup = nav.map(function (item) {
      var active = current === item[2] || (current === "" && item[2] === "index") ? " class=\"active\"" : "";
      return '<a href="' + item[0] + '?reality=infrastructure"' + active + '>' + item[1] + '</a>';
    }).join("");

    var content = infrastructureContent[current] || infrastructureContent.index;
    main.innerHTML = '<header class="masthead civic-masthead">' +
      '<div class="civic-brand"><span class="civic-mark">BIB</span><div><h1>' + reality.label + '</h1><p>community infrastructure monitor // Belfast, Northern Ireland</p></div></div>' +
      '<nav class="tabs civic-nav" aria-label="Civic monitor navigation">' + navMarkup + '</nav>' +
      '</header>' + content +
      '<footer class="site civic-footer"><p class="tagline">Public information. Private frustration. Keep the city moving.</p><p class="email-link"><a href="mailto:belfastisbroken@protonmail.com">belfastisbroken@protonmail.com</a></p><p class="images-link"><a href="images.html?reality=infrastructure">Street image archive</a></p></footer>';
  }

  function renderWatchRepairLegacy() {
    var main = document.querySelector("main.wrap");
    if (!main) return;
    main.innerHTML = '<header class="watch-header"><div class="watch-brand"><span class="watch-mark">BW</span><div><p class="watch-kicker">EST. 1978 // BELFAST CITY CENTRE</p><h1>Belfast Watch Works</h1><p>Repairs, servicing and restoration for mechanical and quartz watches.</p></div></div><nav class="watch-nav"><a class="active" href="index.html?reality=watchrepair">HOME</a><a href="anomalies.html?reality=watchrepair">SERVICES</a><a href="worldwide.html?reality=watchrepair">OUR WORK</a><a href="blog.html?reality=watchrepair">NOTES</a><a href="contact.html?reality=watchrepair">BOOK A REPAIR</a></nav></header><section class="watch-hero"><div><p class="watch-kicker">THE TIME IS WORTH SAVING</p><h2>Small mechanisms.<br />Patient hands.</h2><p>Independent watch repair in Belfast for the pieces that outlast the people who first wore them.</p><a class="watch-button" href="contact.html?reality=watchrepair">BOOK A BENCH SLOT</a></div><figure><img src="assets/images/flickr-landmarks/55055249236_fc6b13ef22_m.jpg" alt="Belfast landmark reference photograph" /><figcaption>Workshop window // Belfast</figcaption></figure></section><section class="watch-services"><article><span>01</span><h3>Service &amp; clean</h3><p>Movement inspection, cleaning, lubrication and regulation for mechanical watches.</p></article><article><span>02</span><h3>Battery &amp; seals</h3><p>Quartz batteries, pressure checks and replacement seals for everyday watches.</p></article><article><span>03</span><h3>Restoration</h3><p>Thoughtful work on inherited watches, worn cases, crystals and old straps.</p></article></section><section class="watch-feature"><img src="assets/images/flickr-landmarks/49997904652_b065fb0d99.jpg" alt="Belfast city reference photograph" /><div><p class="watch-kicker">CURRENT BENCH NOTE // 13 SEPTEMBER</p><h3>A watch does not need to be new to be exact.</h3><p>We repair the mechanism first, then the story around it. Bring the watch, any history you have, and enough time to talk through what it needs.</p><a href="contact.html?reality=watchrepair">SEE OPENING HOURS &rarr;</a></div></section><footer class="site watch-footer"><p>Independent repair, restoration and honest timing.</p><p>Unit 14, Spire Mall, Belfast BT1 2LR</p><p><a href="mailto:belfastisbroken@protonmail.com">belfastisbroken@protonmail.com</a></p><p><a href="images.html?reality=watchrepair">Workshop references</a></p></footer>';
  }

  function renderWatchRepair() {
    var main = document.querySelector("main.wrap");
    if (!main) return;
    var current = page.replace(".html", "");
    var nav = [
      ["index.html", "HOME", "index"],
      ["anomalies.html", "SERVICES", "anomalies"],
      ["worldwide.html", "OUR WORK", "worldwide"],
      ["blog.html", "NOTES", "blog"],
      ["contact.html", "BOOK A REPAIR", "contact"]
    ];
    var navMarkup = nav.map(function (item) {
      var active = current === item[2] ? " class=\"active\"" : "";
      return '<a href="' + item[0] + '?reality=watchrepair"' + active + '>' + item[1] + '</a>';
    }).join("");
    var content = watchRepairContent[current] || watchRepairContent.index;
    main.innerHTML = '<header class="watch-header"><div class="watch-brand"><span class="watch-mark">BW</span><div><p class="watch-kicker">EST. 1978 // BELFAST CITY CENTRE</p><h1>Belfast Watch Works</h1><p>Repairs, servicing and restoration for mechanical and quartz watches.</p></div></div><nav class="watch-nav" aria-label="Watch Works navigation">' + navMarkup + '</nav></header>' + content + '<footer class="site watch-footer"><p>Independent repair, restoration and honest timing.</p><p>Unit 14, Spire Mall, Belfast BT1 2LR</p><p><a href="mailto:belfastisbroken@protonmail.com">belfastisbroken@protonmail.com</a></p><p><a href="images.html?reality=watchrepair">Workshop references</a></p></footer>';
  }

  var watchRepairContent = {
    index: '<section class="watch-hero"><div><p class="watch-kicker">THE TIME IS WORTH SAVING</p><h2>Small mechanisms.<br />Patient hands.</h2><p>Independent watch repair in Belfast for the pieces that outlast the people who first wore them.</p><a class="watch-button" href="contact.html?reality=watchrepair">BOOK A BENCH SLOT</a></div><figure><img src="assets/images/flickr-landmarks/55055249236_fc6b13ef22_m.jpg" alt="Belfast landmark reference photograph" /><figcaption>Workshop window // Belfast</figcaption></figure></section><section class="watch-services"><article><span>01</span><h3>Service &amp; clean</h3><p>Movement inspection, cleaning, lubrication and regulation for mechanical watches.</p></article><article><span>02</span><h3>Battery &amp; seals</h3><p>Quartz batteries, pressure checks and replacement seals for everyday watches.</p></article><article><span>03</span><h3>Restoration</h3><p>Thoughtful work on inherited watches, worn cases, crystals and old straps.</p></article></section><section class="watch-feature"><img src="assets/images/flickr-landmarks/49997904652_b065fb0d99.jpg" alt="Belfast city reference photograph" /><div><p class="watch-kicker">CURRENT BENCH NOTE // 13 SEPTEMBER</p><h3>A watch does not need to be new to be exact.</h3><p>We repair the mechanism first, then the story around it. Bring the watch, any history you have, and enough time to talk through what it needs.</p><a href="contact.html?reality=watchrepair">SEE OPENING HOURS &rarr;</a></div></section>',
    anomalies: '<section class="watch-page-head"><p class="watch-kicker">SERVICES // THE BENCH</p><h2>Careful work, clearly priced.</h2><p>Bring a watch into the shop and we will explain what it needs before any work begins.</p></section><section class="watch-services watch-services-page"><article><span>01</span><h3>Mechanical service</h3><p>Strip, clean, inspect, lubricate and regulate automatic and hand-wound movements.</p><strong>From £95</strong></article><article><span>02</span><h3>Battery replacement</h3><p>Battery, gasket and basic water-resistance check for quartz watches.</p><strong>From £18</strong></article><article><span>03</span><h3>Crystal &amp; strap</h3><p>Replacement crystals, spring bars, leather straps and bracelet adjustments.</p><strong>From £12</strong></article></section>',
    worldwide: '<section class="watch-page-head"><p class="watch-kicker">OUR WORK // SELECTED REPAIRS</p><h2>Worn honestly. Repaired properly.</h2><p>A small selection of the work that comes across the bench in a typical Belfast week.</p></section><section class="watch-work-grid"><figure><img src="assets/images/flickr-landmarks/55055249236_fc6b13ef22_m.jpg" alt="Belfast reference image" /><figcaption>CASE CLEAN // stainless steel automatic</figcaption></figure><figure><img src="assets/images/flickr-landmarks/49997904652_b065fb0d99.jpg" alt="Belfast reference image" /><figcaption>REGULATION // inherited hand-wound piece</figcaption></figure><figure><img src="assets/images/flickr-landmarks/49025893027_d0ce08e703.jpg" alt="Belfast reference image" /><figcaption>STRAP FIT // everyday quartz watch</figcaption></figure></section>',
    blog: '<section class="watch-page-head"><p class="watch-kicker">NOTES // FROM THE BENCH</p><h2>Good watches keep their own time.</h2><p>Short notes about care, repairs and the little signs that a watch needs attention.</p></section><article class="watch-note"><p class="watch-kicker">13 SEPTEMBER // 09:10</p><h3>Do not polish away the evidence.</h3><p>Small scratches tell you how a watch has been worn. We clean carefully, but we do not erase a life from the case.</p></article><article class="watch-note"><p class="watch-kicker">08 SEPTEMBER // 15:40</p><h3>The quiet tick is not always a healthy one.</h3><p>Bring in a watch when it starts losing time, gaining time or stopping overnight. Early service is usually kinder to the movement.</p></article>',
    contact: '<section class="watch-page-head"><p class="watch-kicker">BOOK A REPAIR // SPIRE MALL</p><h2>Tell us what the watch is doing.</h2><p>Describe the make, the problem and whether the watch has sentimental value. We will reply with the next available bench slot.</p></section><form class="watch-form"><label>Your name<input type="text" placeholder="Name" /></label><label>Watch and issue<input type="text" placeholder="Make, model and what has changed" /></label><label>More detail<textarea rows="5" placeholder="Anything else we should know"></textarea></label><button class="watch-button" type="button">REQUEST A BENCH SLOT</button><p>Unit 14, Spire Mall, Belfast BT1 2LR // Tue-Sat 09:30-17:00</p></form>'
  };

  var infrastructureContent = {
    index: '<section class="civic-hero"><div><p class="civic-kicker">LIVE SERVICE STATUS // 13 SEPTEMBER 2026</p><h2>Broken things, properly logged.</h2><p class="civic-lead">A public record of the small failures that make moving through Belfast harder: potholes, dark lamps, blocked drains, damaged kerbs and roads waiting for a repair number.</p><a class="civic-button" href="contact.html?reality=infrastructure">REPORT AN ISSUE</a></div><img src="assets/images/flickr-landmarks/52070221303_49fea7cafe_m.jpg" alt="Belfast street and landmark reference image" /></section><section class="civic-stats"><div><strong>184</strong><span>open reports</span></div><div><strong>37</strong><span>awaiting inspection</span></div><div><strong>62%</strong><span>within target</span></div><div><strong>06:42</strong><span>last sync</span></div></section><section class="civic-columns"><div><h3>Latest reports</h3>' + reportCard("POTHOLE", "A55 approach near York Street", "OPEN", "reported 18 min ago", "assets/images/flickr-landmarks/7071924449_df0c99cdc0_m.jpg") + reportCard("STREETLIGHT", "Shaftesbury Square // lamp 14", "INSPECTION", "updated today", "assets/images/flickr-landmarks/25989402136_078f30cab2_n.jpg") + '</div><aside class="civic-panel"><h3>Area pulse</h3><p><span class="status-dot green"></span> North Belfast <b>stable</b></p><p><span class="status-dot amber"></span> City Centre <b>watch</b></p><p><span class="status-dot red"></span> East Belfast <b>high volume</b></p><a href="worldwide.html?reality=infrastructure">VIEW AREA MAP &rarr;</a></aside></section>',
    anomalies: '<section class="civic-page-head"><p class="civic-kicker">REPORT REGISTER // PUBLIC VIEW</p><h2>Every fault gets a number.</h2><p>Searchable reports from residents, volunteers and people who got tired of stepping around the same problem.</p></section><section class="report-grid">' + reportCard("DRAINAGE", "Blocked gully on Donegall Road", "OPEN", "BR-2048", "assets/images/flickr-landmarks/55055228036_d1d54d6198_m.jpg") + reportCard("PAVEMENT", "Loose paving outside City Hall", "QUEUED", "BR-2047", "assets/images/flickr-landmarks/52373047923_d8f9efe265_n.jpg") + reportCard("POTHOLE", "Deep road defect // Ravenhill Road", "OPEN", "BR-2046", "assets/images/flickr-landmarks/51867014836_f14dcbeca0_w.jpg") + reportCard("SIGNAGE", "Faded pedestrian crossing plate", "INSPECTION", "BR-2045", "assets/images/flickr-landmarks/50192886573_e49dde39e0_n.jpg") + '</section>',
    worldwide: '<section class="civic-page-head"><p class="civic-kicker">AREA MAP // 11 DISTRICTS</p><h2>Belfast, viewed as a repair queue.</h2><p>The city is not a single problem. Zoom into the places where reports cluster, then add the one everyone else has missed.</p></section><div class="civic-map"><div class="map-grid"></div><span class="map-label label-one">CITY CENTRE <b>42</b></span><span class="map-label label-two">NORTH <b>31</b></span><span class="map-label label-three">EAST <b>57</b></span><span class="map-label label-four">SOUTH <b>22</b></span></div><section class="civic-panel wide-panel"><h3>Current maintenance note</h3><p>Reports marked <b>OPEN</b> have been witnessed but not independently verified. Add photographs, exact landmarks and the time you noticed the fault.</p><a href="contact.html?reality=infrastructure">SUBMIT EVIDENCE &rarr;</a></section>',
    blog: '<section class="civic-page-head"><p class="civic-kicker">FIELD NOTES // MAINTENANCE WATCH</p><h2>What the official updates leave out.</h2><p>Short notes from the pavement: repair crews, temporary fixes, recurring failures and the landmarks that help people find them.</p></section><article class="civic-note"><p class="civic-kicker">13 SEP 2026 // 07:18</p><h3>The cone has moved three metres. The hole has not.</h3><p>Someone has placed a barrier beside the defect on the Lisburn Road. It is now easier to see and harder to avoid. No contractor number is visible. We have logged a new photograph and linked it to BR-2046.</p><div class="civic-note-meta">FIELD NOTE 009 // VERIFIED BY 3 CONTRIBUTORS</div></article><article class="civic-note"><p class="civic-kicker">11 SEP 2026 // 16:02</p><h3>A dark street is a report, not an atmosphere.</h3><p>Streetlight faults disappear from public memory quickly. They are more useful when they have a pole number, a nearest address and a second witness.</p><div class="civic-note-meta">FIELD NOTE 008 // OPEN FOR CORRECTIONS</div></article>',
    images: '<section class="civic-page-head"><p class="civic-kicker">PHOTO EVIDENCE // COMMUNITY ARCHIVE</p><h2>Landmarks help locate the damage.</h2><p>Reference images from around Belfast, kept separate from the report record so a road defect can be found again after the cones leave.</p></section><section class="civic-photo-grid"><figure><img src="assets/images/flickr-landmarks/49025893027_d0ce08e703.jpg" alt="Belfast landmark reference photograph" /><figcaption>CITY CENTRE // reference 01</figcaption></figure><figure><img src="assets/images/flickr-landmarks/51091553339_ab3b09f30d.jpg" alt="Belfast street reference photograph" /><figcaption>ROAD EDGE // reference 02</figcaption></figure><figure><img src="assets/images/flickr-landmarks/52983462018_e815c09343_m.jpg" alt="Belfast civic building reference photograph" /><figcaption>PUBLIC BUILDING // reference 03</figcaption></figure><figure><img src="assets/images/flickr-landmarks/52838764357_af1888ff71_m.jpg" alt="Belfast urban landmark reference photograph" /><figcaption>WAYFINDER // reference 04</figcaption></figure></section>',
    contact: '<section class="civic-page-head"><p class="civic-kicker">REPORT A FAULT // COMMUNITY INBOX</p><h2>Give the problem a location.</h2><p>Tell us what is broken, where it is, and what someone would need to see to find it. No council account required.</p></section><form class="civic-form"><label>Issue type<select><option>Pothole or road surface</option><option>Streetlight</option><option>Drainage or flooding</option><option>Pavement or kerb</option><option>Signage or crossing</option></select></label><label>Location<input type="text" placeholder="street, landmark or postcode" /></label><label>What happened<textarea rows="5" placeholder="Describe the fault and when you noticed it"></textarea></label><button class="civic-button" type="button">ADD TO REPORT QUEUE</button><p class="civic-form-note">This demonstration form does not submit to Belfast City Council.</p></form>'
  };

  function reportCard(type, title, status, meta, image) {
    return '<article class="report-card"><img src="' + image + '" alt="Belfast infrastructure reference image" /><div><p class="report-type">' + type + '</p><h3>' + title + '</h3><p class="report-meta">' + meta + '</p><span class="report-status status-' + status.toLowerCase() + '">' + status + '</span></div></article>';
  }
})();
