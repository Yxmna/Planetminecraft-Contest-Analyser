document.getElementById("contest_name").addEventListener("keydown", function(e) {
  if (e.code == "Enter" || e.code == "NumpadEnter") {
    EnterToTheMine();
  }
});
document.getElementById("planetmc_name").addEventListener("keydown", function(e) {
  if (e.code === "Enter") {
    Search();
  }
});

var pages = [];
var chest = {};
var t = 0;
var url = "";


function EnterToTheMine() {
  pages = [];
  chest = {};
  t = 0;
  document.getElementById("contest_img").src = "";
  document.getElementById("hight").innerHTML = "?? 💎";
  document.getElementById("small").innerHTML = "?? 💎";
  document.getElementById("log").innerHTML = "";
  if (document.getElementById("contest_name").value.startsWith("https://www.planetminecraft.com/")) {
    url = document.getElementById("contest_name").value;
  } else {
    url = "https://www.planetminecraft.com/contests/" + document.getElementById("contest_name").value.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, " ").split(" ").join("-").toLowerCase();
  }
  Logger("> Analyse mine size..")
  fetch(url)
    .then(function(response) {
      return response.text();
    })
    .then(function(result) {
      // MineDiamond(result);
      try {
        var page_count = Math.ceil((result.split("Entries (")[1].split(")\"")[0]) / 25)
      } catch (e) {
        Logger("✕ Error, Invalid URL")
      }
      Logger("- Underground gallery found: " + page_count);
      SearchDiamond(page_count);
    })
    .catch(function() {
      Logger("✕ Error, Allow-Origin is not bypassed");
      Logger("Download CORS Everywhere:");
      Logger("https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/");
      Logger("And activate it in a planetminecraft page");
    })

}


function SearchDiamond(page_count) {
  for (var i = 0; i < page_count; i++) {
    Logger("> Mine diamonds, gallery " + (i + 1) + "..");
    fetch(url + "/entries/?p=" + (i + 1))
      .then(function(response) {
        return response.text();
      })
      .then(function(result) {
        pages.push(result.split('id="right"')[0].split('id="center"')[1].split('resource_list')[1]);
        if (pages.length == page_count) {
          document.getElementById("contest_img").src = result.split('" title="Minecraft Contest"')[0].split("<img src=\"")[1];
          Logger("- Diamonds mined !");
          StoreDiamond(pages);
        }
      })
  }
}

// function resize() {
//   document.getElementById("log").style.height = "calc(" + document.getElementById("contest_img").offsetHeight + "px - 35px)";
// }

function StoreDiamond(pages) {
  Logger("> Store diamonds..");
  pages.forEach((page, i) => {
    page.split("</li>").forEach((resource, j) => {
      if (resource.search("Give diamond") > 0) {
        var title = resource.split("class=\"r-title\" >")[1].split("class=\"r-subtitle")[0].split("</a><div")[0];
        var img_url = resource.split("src=\"")[1].split(".jpg")[0];
        var link = resource.split('href="')[1].split('"')[0];
        var author = resource.split(' avatar\"/> ')[1].split("\n</a>")[0];
        var author_img = resource.split('/files/avatar/')[1].split("\" loading=")[0];
        if (resource.split("grid-only\">").length > 1) {
          var diamonds = Math.floor(resource.split("grid-only\">")[1].split("</span")[0]);
        } else {
          var diamonds = 0;
        }
        if (resource.split('c-num-favs grid-only">').length > 1) {
          var favorites = Math.floor(resource.split('c-num-favs grid-only">')[1].split("</span")[0]);
        } else {
          var favorites = 0;
        }
        if (resource.split('title="downloads"').length > 1) {
          var downloads = resource.split('title="downloads"></i> <span>')[1].split("</span")[0];
          if (downloads.split("k").length > 1) {
            downloads = parseFloat(downloads.split("k")[0]) * 1000;
          } else {
            downloads = Math.floor(downloads);
          }
        } else {
          var downloads = 56478647860;
        }
        if (resource.split('title="views"').length > 1) {
          var views = resource.split('title="views"></i> <span>')[1].split("</span")[0];
          if (views.split("k").length > 1) {
            views = parseFloat(views.split("k")[0]) * 1000;
          } else {
            views = Math.floor(views);
          }
        } else {
          var views = 0;
        }
        chest[t] = {
          "title": title,
          "diamonds": Math.floor(diamonds),
          "img_url": img_url + ".jpg",
          "link": "https://www.planetminecraft.com" + link,
          "author": author,
          "author_img": "https://static.planetminecraft.com/files/avatar/" + author_img,
          "favorites": favorites,
          "views": views,
          "downloads": downloads
        };
        t++;
      }
    });
  });
  DisplayDiamond();
}


function DisplayDiamond() {
  Logger("> Display diamonds..");
  var chest_sorted = Object.values(chest).sort((a, b) => {
    return b.favorites - a.favorites;
  }).sort((a, b) => {
    return b.diamonds - a.diamonds;
  });
  chest = Object.assign({}, chest_sorted);
  document.getElementById("hight").innerHTML = chest[0].diamonds + " - " + chest[24].diamonds + " 💎";
  document.getElementById("small").innerHTML = chest[24].diamonds + " - " + chest[49].diamonds + " 💎";
  document.getElementById("ul").innerHTML = "";
  Object.values(chest).forEach((item, i) => {
    var li = document.createElement("li");
    var div_one = document.createElement("div");
    var div_two = document.createElement("div");
    var div = document.createElement("div");
    var stats = document.createElement("div");
    var img = document.createElement("img");
    var h1 = document.createElement("h1");
    var rank = document.createElement("h1");
    var diamonds = document.createElement("h2");
    var favorites = document.createElement("h2");
    var downloads = document.createElement("h2");
    var views = document.createElement("h2");
    var author = document.createElement("h3");
    var author_img = document.createElement("img");
    var author_div = document.createElement("div");
    li.id = item.author;
    img.src = item.img_url;
    h1.innerHTML = item.title;
    diamonds.innerHTML = item.diamonds + " 💎";
    favorites.innerHTML = item.favorites + " 💖";
    downloads.innerHTML = item.downloads + " ⏬";
    views.innerHTML = item.views + " 👀";
    rank.innerHTML = "#" + (i + 1);
    author_img.src = item.author_img;
    author.innerHTML = item.author;
    if ((i + 1) <= 25) {
      rank.classList.add("top_25");
    } else if ((i + 1) <= 50) {
      rank.classList.add("top_50");
    }
    div.classList.add("content");
    div_one.classList.add("div_one");
    div_two.classList.add("div_two");
    author_div.classList.add("author_div");
    stats.classList.add("stats");
    diamonds.classList.add("diamonds");
    favorites.classList.add("favorites");
    views.classList.add("views");
    downloads.classList.add("downloads");
    author_div.appendChild(author_img);
    author_div.appendChild(author);
    stats.appendChild(diamonds);
    stats.appendChild(favorites);
    stats.appendChild(views);
    stats.appendChild(downloads);
    div_one.appendChild(h1);
    div_one.appendChild(rank);
    div_two.appendChild(author_div);
    div_two.appendChild(stats);
    div.appendChild(div_one);
    div.appendChild(div_two);
    li.appendChild(img);
    li.appendChild(div);
    document.getElementById("ul").appendChild(li);
    // Logger("- 💎");
    console.log("- 💎");
  });
  Logger("- Diamonds displayed !");
}


function Logger(text) {
  console.log(text);
  var li = document.createElement("li");
  if (text.startsWith("https")) {
    var link = document.createElement("a");
    link.href = text;
    link.innerHTML = text;
    li.appendChild(link);
  } else {
    li.innerHTML = text;
  }
  document.getElementById("log").appendChild(li);
}

function Search() {
  window.location = window.location.pathname + "#" + document.getElementById("planetmc_name").value;
}


// TODO: link, Background Top x, Aside, link remove entries, if finish, error origin
