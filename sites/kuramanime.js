const cheerio = require("cheerio");
const express = require("express");
const router = express.Router();
const baseURL = "https://kuramanime.dad";

//On Going
//OrderBy Try => updated, most_viewed, popular, latest, oldest, ascending, descending
const OnGoing = async (req, res) => {
  try {
    const urlOnGoing = `${baseURL}/quick/ongoing?order_by=${req.params.order_by}&page=${req.params.page}`;
    const response = await fetch(urlOnGoing);
    const data = await response.text();
    const $ = cheerio.load(data);
    let prevPage = $("a.gray__color .fa-angle-left").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      prevPage = false;
    }
    let nextPage = $("a.gray__color .fa-angle-right").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      nextPage = false;
    }
    let dat = [];
    const el = $("div#animeList > div.col-lg-4 > div.product__item").each((i, e) => {
      dat.push({
        tipe: $(e).find("div > ul > a").map((i, el) => $(el).text().trim()).get(),
        nimeID: $(e).find("div > a").attr("href")?.split("/")[4],
        epsNum: $(e).find("div > a").attr("href")?.split("/")[7],
        eps: $(e).find("a > div > div.ep > span").text().trim(),
        judul: $(e).find("div > h5").text().replace(/\\/g, "").trim(),
        slug: $(e).find("div > a").attr("href")?.split("/")[5],
        gambar: $(e).find("a > div").attr("data-setbg")?.trim()
      })
    });
    res.end(JSON.stringify({
      status: "success",
      statusCode: 200,
      page: req.params.page,
      prevPage: prevPage,
      nextPage: nextPage,
      order_by: req.params.order_by,
      data: dat
    }, null, 1));
  } catch (error) {
    res.end(JSON.stringify({
      status: error.message,
      statusCode: 500
    }, null, 1));
  }
};
router.get("/ongoing/:order_by/:page", OnGoing);

//Completed
//OrderBy Try => updated, most_viewed, popular, latest, oldest, ascending, descending
const Completed = async (req, res) => {
  try {
    const urlCompleted = `${baseURL}/quick/finished?order_by=${req.params.order_by}&page=${req.params.page}`;
    const response = await fetch(urlCompleted);
    const data = await response.text();
    const $ = cheerio.load(data);
    let prevPage = $("a.gray__color .fa-angle-left").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      prevPage = false;
    }
    let nextPage = $("a.gray__color .fa-angle-right").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      nextPage = false;
    }
    let dat = [];
    const el = $("div#animeList > div.col-lg-4 > div.product__item").each((i, e) => {
      dat.push({
        tipe: $(e).find("div > ul > a").map((i, el) => $(el).text().trim()).get(),
        nimeID: $(e).find("div > a").attr("href")?.split("/")[4],
        rating: $(e).find("a > div > div.ep > span").text().trim(),
        judul: $(e).find("div > h5").text().replace(/\\/g, "").trim(),
        slug: $(e).find("div > a").attr("href")?.split("/")[5],
        gambar: $(e).find("a > div").attr("data-setbg")?.trim()
      })
    });
    res.end(JSON.stringify({
      status: "success",
      statusCode: 200,
      page: req.params.page,
      prevPage: prevPage,
      nextPage: nextPage,
      order_by: req.params.order_by,
      data: dat
    }, null, 1));
  } catch (error) {
    res.end(JSON.stringify({
      status: error.message,
      statusCode: 500
    }, null, 1));
  }
};
router.get("/completed/:order_by/:page", Completed);

//Movies
//OrderBy Try => updated, most_viewed, popular, latest, oldest, ascending, descending
const Movies = async (req, res) => {
  try {
    const urlMovies = `${baseURL}/quick/movie?order_by=${req.params.order_by}&page=${req.params.page}`;
    const response = await fetch(urlMovies);
    const data = await response.text();
    const $ = cheerio.load(data);
    let prevPage = $("a.gray__color .fa-angle-left").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      prevPage = false;
    }
    let nextPage = $("a.gray__color .fa-angle-right").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      nextPage = false;
    }
    let dat = [];
    const el = $("div#animeList > div.col-lg-4 > div.product__item").each((i, e) => {
      dat.push({
        tipe: $(e).find("div > ul > a").map((i, el) => $(el).text().trim()).get(),
        nimeID: $(e).find("div > a").attr("href")?.split("/")[4],
        rating: $(e).find("a > div > div.ep > span").text().trim(),
        judul: $(e).find("div > h5").text().replace(/\\/g, "").trim(),
        slug: $(e).find("div > a").attr("href")?.split("/")[5],
        gambar: $(e).find("a > div").attr("data-setbg")?.trim()
      })
    });
    res.end(JSON.stringify({
      status: "success",
      statusCode: 200,
      page: req.params.page,
      prevPage: prevPage,
      nextPage: nextPage,
      order_by: req.params.order_by,
      data: dat
    }, null, 1));
  } catch (error) {
    res.end(JSON.stringify({
      status: error.message,
      statusCode: 500
    }, null, 1));
  }
};
router.get("/movies/:order_by/:page", Movies);

//Anime Info
//nimeID Try => 50
//slug Try => one+piece
const AnimeInfo = async (req, res) => {
  try {
    const urlAnimeInfo = `${baseURL}/anime/${req.params.nimeID}/${req.params.slug}`;
    const nimeID = `${req.params.nimeID}`;
    const slug = `${req.params.slug}`;
    const response = await fetch(urlAnimeInfo);
    const data = await response.text();
    const $ = cheerio.load(data);
    let dat = [];
    const allEps = await getEpsList(urlAnimeInfo);
    const batchElement = $("#episodeBatchLists");
    let batchId = "?";
    if (batchElement.length) {
      const batchContent = batchElement.attr("data-content");
      if (batchContent) {
        const $batchContent = cheerio.load(batchContent);
        const batchLink = $batchContent("a").attr("href");
        if (batchLink) {
          const parts = batchLink.split("/");
          batchId = parts[parts.length - 1] || "?";
        }
      }
    }
    const el = $("section.anime-details > div.container > div.anime__details__content").each((i, e) => {
      dat.push({
        title: $(".anime__details__title h3").text().trim(),
        alternativeTitle: $(".anime__details__title span").text().trim(),
        image: $(".anime__details__pic").attr("data-setbg") || "",
        synopsis: $("#synopsisField").html()?.replace(/(<br\s*\/?>|<\/?i>)+/gi, " ").trim() || "",
        type: $(".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(1) > div > div > a").text().trim(),
        totalEpisodes: $(".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(2) > div > div > a").text().trim(),
        status: $(".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(3) > div > div > a").text().trim(),
        release: $(".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(4) > div > div > a").text().trim(),
        season: $(".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(5) > div > div > a").text().trim(),
        duration: $(".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(6) > div > div > a").text().trim(),
        quality: $(".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(7) > div > div > a").text().trim(),
        country: $(".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(8) > div > div > a").text().trim(),
        adaptation: $(".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(9) > div > div > a").text().trim(),
        genres: $(".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(1) > div > div > a").map((i, e) => $(e).text().replace(/,/g, "").trim()).get(),
        eksplisit: $(".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(2) > div > div > a").text().trim(),
        demographic: $(".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(3) > div > div > a").text().trim(),
        theme: $(".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(4) > div > div > a").text()?.replace("\n\n", " ").trim(),
        studio: $(".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(5) > div > div > a").text().trim(),
        score: $(".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(6) > div > div > a").text().trim(),
        enthusiast: $(".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(7) > div > div > a").text().trim(),
        ratings: $(".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(8) > div > div > a").text().trim(),
        credit: $(".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(9) > div > div > a").text().replace("\n\n", " ").trim(),
        epsList: allEps,
        batchId: batchId
      })
    });
    res.end(JSON.stringify({
      status: "success",
      statusCode: 200,
      nimeID: nimeID,
      slug: slug,
      data: dat
    }, null, 1));
  } catch (error) {
    res.end(JSON.stringify({
      status: error.message,
      statusCode: 500
    }, null, 1));
  }
};
router.get("/animeinfo/:nimeID/:slug", AnimeInfo);

//Search
//slug Try => One+Piece
//OrderBy Try => updated, most_viewed, popular, latest, oldest, ascending, descending
const Search = async (req, res) => {
  try {
    const urlSearch = `${baseURL}/anime?order_by=${req.params.order_by}&search=${req.params.slug}&page=${req.params.page}`;
    const response = await fetch(urlSearch);
    const data = await response.text();
    const $ = cheerio.load(data);
    let prevPage = $("a.gray__color .fa-angle-left").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      prevPage = false;
    }
    let nextPage = $("a.gray__color .fa-angle-right").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      nextPage = false;
    }
    let dat = [];
    const el = $("div#animeList > div.col-lg-4 > div.product__item").each((i, e) => {
      dat.push({
        tipe: $(e).find("div > ul > a").map((i, el) => $(el).text().trim()).get(),
        nimeID: $(e).find("div > a").attr("href")?.split("/")[4],
        rating: $(e).find("a > div > div.ep > span").text().trim(),
        judul: $(e).find("div > h5").text().replace(/\\/g, "").trim(),
        slug: $(e).find("div > a").attr("href")?.split("/")[5],
        gambar: $(e).find("a > div").attr("data-setbg")?.trim()
      })
    });
    res.end(JSON.stringify({
      status: "success",
      statusCode: 200,
      page: req.params.page,
      prevPage: prevPage,
      nextPage: nextPage,
      order_by: req.params.order_by,
      slug: req.params.slug,
      data: dat
    }, null, 1));
  } catch (error) {
    res.end(JSON.stringify({
      status: error.message,
      statusCode: 500
    }, null, 1));
  }
};
router.get("/search/:order_by/:slug/:page", Search);

//Streaming
//nimeID Try => 50
//slug Try => One+Piece
//eps Try => 1000
const Streaming = async (req, res) => {
  try {
    const urlStreaming = `${baseURL}/anime/${req.params.nimeID}/${req.params.slug}/episode/${req.params.eps}`;
    const nimeID = `${req.params.nimeID}`;
    const slug = `${req.params.slug}`;
    const eps = `${req.params.eps}`;
    const servers = ["kuramadrive", "archive", "archive-v2"];
    const response = await fetch(urlStreaming);
    const data = await response.text();
    const $ = cheerio.load(data);
    const strKps = $("div.mt-3:nth-child(2)").attr("data-kps");
    if (!strKps) {
      return res.end(JSON.stringify({
        status: false,
        message: "KPS String Not Found!!!"
      }, null, 1));
    }
    const kpsRes = await fetch(`${baseURL}/assets/js/${strKps}.js`);
    const kpsDat = await kpsRes.text();
    const exDatKps = toolExDat(kpsDat);
    if (!exDatKps) {
      return res.end(JSON.stringify({
        status: false,
        message: "Failed to Extract Data KPS!!!"
      }, null, 1));
    }
    const authRes = await fetch(`${baseURL}/assets/${exDatKps.MIX_AUTH_ROUTE_PARAM}`);
    const auth = await authRes.text();
    const promises = servers.map(async (server) => {
      const vidRes = await fetch(`${baseURL}/anime/${req.params.nimeID}/${req.params.slug}/episode/${req.params.eps}?${exDatKps.MIX_PAGE_TOKEN_KEY}=${auth}&${exDatKps.MIX_STREAM_SERVER_KEY}=${server}`);
      const vidDat = await vidRes.text();
      const $ = cheerio.load(vidDat);
      const judulEps = $("#episodeTitle").text().trim();
      const slugEps = $(".center__nav").attr("href")?.split("/")[5];
      const prevEps = $(".before__nav.ep-button").attr("href")?.split("/")[7];
      const nextEps = $(".after__nav.ep-button").attr("href")?.split("/")[7];
      const listStream = $("#player > source").map((i, e) => ({
        urlStream: $(e).attr("src"),
        tipeStrean: $(e).attr("type"),
        ukuranStream: `${$(e).attr("size")}p (${server})`
      })).get();
      const downLinks = $("#animeDownloadLink h6").map((i, elem) => {
        const quality = $(elem).text().trim();
        const links = $(elem).nextAll("a").map((j, link) => ({
          serverDown: $(link).text().trim(),
          urlDown: $(link).attr("href")
        })).get();
        return { quality, links };
      }).get();
      return {
        judulEps,
        slugEps,
        prevEps,
        nextEps,
        listStream,
        downLinks,
      };
    });
    const results = await Promise.all(promises);
    const listVidStream = results.flatMap((result) => result.listStream);
    const judulEps = results[0].judulEps;
    const slugEps = results[0].slugEps;
    const prevEps = results[0].prevEps;
    const nextEps = results[0].nextEps;
    const downLinks = results[0].downLinks;
    res.end(JSON.stringify({
      status: "success",
      statusCode: 200,
      judulEps: judulEps,
      slugEps: slugEps,
      prevEps: prevEps,
      nextEps: nextEps,
      listStream: listVidStream,
      downLinks: downLinks
    }, null, 1));
  } catch (error) {
    res.end(JSON.stringify({
      status: error.message,
      statusCode: 500
    }, null, 1));
  }
};
router.get("/streaming/:nimeID/:slug/:eps", Streaming);

//Batch Download
//nimeID Try => 195
//slug Try => zi-chuan
//batchID Try => 1-25
const BatchDown = async (req, res) => {
  try {
    const urlBatchDown = `${baseURL}/anime/${req.params.nimeID}/${req.params.slug}/batch/${req.params.batchID}`;
    const response = await fetch(urlBatchDown);
    const data = await response.text();
    const $ = cheerio.load(data);
    const strKps = $("div.mt-3:nth-child(2)").attr("data-kps");
    if (!strKps) {
      return res.end(JSON.stringify({
        status: false,
        message: "KPS String Not Found!!!"
      }, null, 1));
    }
    const kpsRes = await fetch(`${baseURL}/assets/js/${strKps}.js`);
    const kpsDat = await kpsRes.text();
    const exDatKps = toolExDat(kpsDat);
    if (!exDatKps) {
      return res.end(JSON.stringify({
        status: false,
        message: "Failed to Extract Data KPS!!!"
      }, null, 1));
    }
    const authRes = await fetch(`${baseURL}/assets/${exDatKps.MIX_AUTH_ROUTE_PARAM}`);
    const auth = await authRes.text();    
    const servers = ["kuramadrive", "archive", "archive-v2"];
    const downLinksMap = new Map();
    await Promise.all(
      servers.map(async (server) => {
        const vidRes = await fetch(`${baseURL}/anime/${req.params.nimeID}/${req.params.slug}/batch/${req.params.batchID}?${exDatKps.MIX_PAGE_TOKEN_KEY}=${auth}&${exDatKps.MIX_STREAM_SERVER_KEY}=${server}`);
        const vidDat = await vidRes.text();
        const $ = cheerio.load(vidDat);
        $("#animeDownloadLink h6").each((i, elem) => {
          const quality = $(elem).text().trim();
          const links = [];
          $(elem).nextUntil("h6").filter("a").each((j, sibling) => {
            links.push({
              serverDown: $(sibling).text().trim(),
              urlDown: $(sibling).attr("href"),
            });
          });
          if (["MKV 480p", "MKV 720p", "MP4 360p", "MP4 480p", "MP4 720p"].some((q) => quality.includes(q))) {
            if (!downLinksMap.has(quality)) {
              downLinksMap.set(quality, links);
            } else {
              const existingLinks = downLinksMap.get(quality);
              links.forEach((link) => {
                if (!existingLinks.some((existingLink) => existingLink.url === link.url)) {
                  existingLinks.push(link);
                }
              });
            }
          }          
        });
      })
    );
    const DownBatchLink = Array.from(
      downLinksMap,
      ([quality, links]) => ({ quality, links })
    );
    res.end(JSON.stringify({
      status: "success",
      statusCode: 200,
      DownBatchLink: DownBatchLink
    }, null, 1));
  } catch (error) {
    res.end(JSON.stringify({
      status: error.message,
      statusCode: 500
    }, null, 1));
  }
};
router.get("/batch/:nimeID/:slug/:batchID", BatchDown);

//Schedule
//Schedule Day => all, monday, tuesday, wednesday, thursday, friday, saturday, sunday, random
const Schedule = async (req, res) => {
  try {
    const urlSchedule = `${baseURL}/schedule?scheduled_day=${req.params.scheduled_day}&page=${req.params.page}`;
    const response = await fetch(urlSchedule);
    const data = await response.text();
    const $ = cheerio.load(data);
    let prevPage = $("a.gray__color .fa-angle-left").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      prevPage = false;
    }
    let nextPage = $("a.gray__color .fa-angle-right").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      nextPage = false;
    }
    let dat = [];
    const el = $("div#animeList > div.col-lg-4 > div.product__item").each((i, e) => {
      dat.push({
        tipe: $(e).find("div > ul > a").map((i, el) => $(el).text().trim()).get(),
        nimeID: $(e).find("div > a").attr("href")?.split("/")[4],
        hari: $(e).find("a > div > div.view-end > ul > li:nth-child(1) > span").text().trim(),
        waktu: $(e).find("a > div > div.view-end > ul > li:nth-child(2) > span").text().trim(),
        eps: $(e).find("a > div > div.ep > span:last-child").text().trim().replace("\n", " "),
        judul: $(e).find("div > h5").text().replace(/\\/g, "").trim(),
        slug: $(e).find("div > a").attr("href")?.split("/")[5],
        gambar: $(e).find("a > div").attr("data-setbg")?.trim()
      })
    });
    res.end(JSON.stringify({
      status: "success",
      statusCode: 200,
      page: req.params.page,
      prevPage: prevPage,
      nextPage: nextPage,
      jadwal: req.params.scheduled_day,
      data: dat
    }, null, 1));
  } catch (error) {
    res.end(JSON.stringify({
      status: error.message,
      statusCode: 500
    }, null, 1));
  }
};
router.get("/schedule/:scheduled_day/:page", Schedule);

//Properties Type
//Type => genre, season, studio, type, quality, source, country
const PropertiesType = async (req, res) => {
  try {
    const urlPropertiesType = `${baseURL}/properties/${req.params.ptype}`;
    const response = await fetch(urlPropertiesType);
    const data = await response.text();
    const $ = cheerio.load(data);
    let dat = [];
    const el = $("div#animeList > div.container > div.kuramanime__genres > ul > li").each((i, e) => {
      dat.push({
        nama: $(e).find("a").text(),
        propertiesID: $(e).find("a").attr("href")?.split("/")[5].split("?")[0]
      })
    });
    res.end(JSON.stringify({
      status: "success",
      statusCode: 200,
      propertiesType: req.params.ptype,
      data: dat
    }, null, 1));
  } catch (error) {
    res.end(JSON.stringify({
      status: error.message,
      statusCode: 500
    }, null, 1));
  }
};
router.get("/properties/:ptype", PropertiesType);

//Properties Anime
//Properties Type => genre, season, studio, type, quality, source, country
//Properties ID : Example => for genre is action or sesason is fall 2024
//OrderBy => updated, most_viewed, popular, latest, oldest, ascending, descending
const PropertiesAnime = async (req, res) => {
  try {
    const urlPropertiesAnime = `${baseURL}/properties/${req.params.ptype}/${req.params.pid}?order_by=${req.params.order_by}&page=${req.params.page}`;
    const response = await fetch(urlPropertiesAnime);
    const data = await response.text();
    const $ = cheerio.load(data);
    let prevPage = $("a.gray__color .fa-angle-left").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      prevPage = false;
    }
    let nextPage = $("a.gray__color .fa-angle-right").length > 0 ? false : true;
    if (!$(".product__pagination").length) {
      nextPage = false;
    }
    let dat = [];
    const el = $("div#animeList > div.col-lg-4 > div.product__item").each((i, e) => {
      dat.push({
        tipe: $(e).find("div > ul > a").map((i, el) => $(el).text().trim()).get(),
        nimeID: $(e).find("div > a").attr("href")?.split("/")[4],
        rating: $(e).find("a > div > div.ep > span").text().trim(),
        judul: $(e).find("div > h5").text().replace(/\\/g, "").trim(),
        slug: $(e).find("div > a").attr("href")?.split("/")[5],
        gambar: $(e).find("a > div").attr("data-setbg")?.trim()
      })
    });
    res.end(JSON.stringify({
      status: "success",
      statusCode: 200,
      page: req.params.page,
      prevPage: prevPage,
      nextPage: nextPage,
      order_by: req.params.order_by,
      propertiesID: req.params.pid,
      propertiesType: req.params.ptype,
      data: dat
    }, null, 1));
  } catch (error) {
    res.end(JSON.stringify({
      status: error.message,
      statusCode: 500
    }, null, 1));
  }
};
router.get("/properties/:ptype/:pid/:order_by/:page", PropertiesAnime);

//Get Eps List From Anime Info
const getEpsList = async (url, epsList = []) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const $$ = $("#episodeLists").attr("data-content");
    const $$$ = cheerio.load($$);
    const callEps = $$$("a.btn-danger").map((index, element) => {
      const eps = $$$(element).attr("href")?.split("/")[7];
      const epsTitle = $$$(element).text().trim();
      return {
        eps: eps,
        epsTitle: epsTitle
      };
    }).get();
    epsList.push(...callEps);
    const nextPageEps = $$$("a.page__link__episode i.fa-forward").parent().attr("href");
    if (nextPageEps) {
      const gnPageEps = new URL(nextPageEps, url).href;
      return await getEpsList(gnPageEps, epsList);
    }
    return epsList;
  } catch (error) {
    res.end(JSON.stringify({
      status: error.message,
      statusCode: 500
    }, null, 1));
    return epsList;
  }
};
module.exports = getEpsList;

//Extract Data Video Streaming
function toolExDat(jsBody) {
  const regex = /window\.process\s*=\s*({[\s\S]*?});/;
  const match = jsBody.match(regex);
  if (match && match[1]) {
    const rawData = match[1];
    try {
      const jsonString = rawData
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"')
        .replace(/,\s*}/g, "}");
      const processData = JSON.parse(jsonString);
      return {
        MIX_AUTH_ROUTE_PARAM: processData.env.MIX_AUTH_ROUTE_PARAM,
        MIX_PAGE_TOKEN_KEY: processData.env.MIX_PAGE_TOKEN_KEY,
        MIX_STREAM_SERVER_KEY: processData.env.MIX_STREAM_SERVER_KEY,
      };
    } catch (error) {
      res.end(JSON.stringify({
        status: error.message,
        statusCode: 500
      }, null, 1));
      return null;
    }
  }
  return null;
}
module.exports = toolExDat

router.get("/", function (req, res) {
  res.end(JSON.stringify({
     message: "😍 GG Nime Server => 1 is Ready! 🚀",
  }, null, 1));
});

module.exports = router;
