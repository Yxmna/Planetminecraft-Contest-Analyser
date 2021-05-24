var input = document.getElementById("contest_name");
input.addEventListener("keydown", function(e) {
  if (e.code === "Enter") {
    EnterToTheMine();
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
  if (document.getElementById("contest_name").value.startsWith("https://www.planetminecraft.com/")) {
    url = document.getElementById("contest_name").value;
  } else {
    url = "https://www.planetminecraft.com/contests/" + document.getElementById("contest_name").value.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, " ").split(" ").join("-").toLowerCase();
  }
  console.log("> Getting page count..");
  fetch(url)
    .then(function(response) {
      return response.text();
    })
    .then(function(result) {
      // MineDiamond(result);
      var page_count = Math.ceil((result.split("Entries (")[1].split(")\"")[0]) / 25);
      console.log("- Pages found: " + page_count);
      SearchDiamond(page_count);
    })

}


function SearchDiamond(page_count) {
  for (var i = 0; i < page_count; i++) {
    console.log("> Getting page " + (i + 1) + "..");
    fetch(url + "/entries/?p=" + (i + 1))
      .then(function(response) {
        return response.text();
      })
      .then(function(result) {
        pages.push(result);
        console.log(pages.length);
        console.log(page_count);
        if (pages.length == page_count) {
          console.log("START");
          MineDiamond(pages)
        }
      })
  }
}


function MineDiamond(pages) {
  pages.forEach((page, i) => {
    page.split("pane_content")[0].split("class=\"resource r-data \" data-type=\"resource\"").forEach((item, j) => {
      var resource = item.split("class=\"r-details")[0];
      if (resource.search("Give diamond") > 0) {
        var title = resource.split("class=\"r-title\" >")[1].split("class=\"r-subtitle")[0].split("</a><div")[0];
        var img_url = resource.split("src=\"")[1].split(".jpg")[0];
        if (resource.split("grid-only\">").length > 1) {
          var diamonds = Math.floor(resource.split("grid-only\">")[1].split("</span")[0]);
        } else {
          diamonds = 0;
        }
        chest[t] = {
          "title": title,
          "diamonds": Math.floor(diamonds),
          "img_url": img_url + ".jpg"
        };
        t++;
      }
    });
  });
  List();
}



function List() {

  var chest_sorted = Object.values(chest).sort((a, b) => {
    return b.diamonds - a.diamonds
  });
  console.log(chest_sorted);
  chest = Object.assign({}, chest_sorted);


  document.getElementById("ul").innerHTML = "";
  Object.values(chest).forEach((item, i) => {

    // console.log(item.title);

    var li = document.createElement("li");
    var div = document.createElement("div");
    var img = document.createElement("img");
    var h1 = document.createElement("h1");
    var h2 = document.createElement("h2");
    img.src = item.img_url;
    h1.innerHTML = (i+1) + ". " + item.title;
    h2.innerHTML = item.diamonds + " diamonds";
    div.appendChild(h1);
    div.appendChild(h2);
    li.appendChild(img);
    li.appendChild(div);
    document.getElementById("ul").appendChild(li);

  });





}
