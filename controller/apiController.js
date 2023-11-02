const cheerio = require("cheerio")
const axios = require("axios")
const baseUrl = process.env.BASE_URL
const headers = { "User-Agent": "Chrome", }
require("dotenv").config()

const getOnGoing = async (req, res) => {
    const { page = 1 } = req.params
    const onGoing = []
    let endpoint, poster, eps, type, title
    axios({
        url: `${baseUrl}/anime-ongoing/page/${page}`,
        method: "get", headers
    }).then((result) => {
        const $ = cheerio.load(result.data)

        $(".excstf .styletwo").each((_, el) => {
            endpoint = $(el).find("a.tip").attr("href").replace("https://hqnime.com/anime", "").replace(/\//g, "")
            poster = $(el).find("img").attr("src")
            eps = $(el).find("span.epx").text()
            type = $(el).find(".typez").text()
            title = $(el).find(".tt > h2").text()

            onGoing.push({ endpoint, poster, eps, type, title })
        })
        res.json({
            message: "berhasil",
            results: {
                page: parseInt(page),
                onGoing
            }
        })

    }).catch((err) => res.json({ message: err ? err.message : "gagal" }))
}

const getCompleted = async (req, res) => {
    const { page = 1 } = req.params
    const completed = []
    let endpoint, poster, eps, type, title, rating
    axios({
        url: `${baseUrl}/anime-completed/page/${page}`,
        method: "get", headers
    }).then((result) => {
        const $ = cheerio.load(result.data)

        $(".excstf .bs").each((_, el) => {
            endpoint = $(el).find("a.tip").attr("href").replace("https://hqnime.com/anime", "").replace(/\//g, "")
            poster = $(el).find("img").attr("src")
            eps = $(el).find("span.epx").text()
            type = $(el).find(".typez").text()
            title = $(el).find(".tt > h2").text()
            rating = parseFloat($(el).find(".ratingnya").text())

            completed.push({ endpoint, poster, eps, type, title, rating })
        })
        res.json({
            message: "berhasil",
            results: {
                page: parseInt(page),
                completed
            }
        })

    }).catch((err) => res.json({ message: err ? err.message : "gagal" }))
}

const getSearch = async (req, res) => {
    const { page = 1, q } = req.params
    const search = []
    let endpoint, poster, eps, type, title, rating
    axios({
        url: `${baseUrl}/page/${page}/?s=${q}`,
        method: "get", headers
    }).then((result) => {
        const $ = cheerio.load(result.data)

        $(".listupd .bs").each((_, el) => {
            endpoint = $(el).find("a.tip").attr("href").replace("https://hqnime.com/anime", "").replace(/\//g, "")
            poster = $(el).find("img").attr("src")
            eps = $(el).find("span.epx").text()
            type = $(el).find(".typez").text()
            title = $(el).find(".tt > h2").text()
            rating = parseFloat($(el).find(".ratingnya").text())

            search.push({ endpoint, poster, eps, type, title, rating })
        })
        res.json({
            message: "berhasil",
            results: {
                page: parseInt(page),
                search
            }
        })

    }).catch((err) => res.json({ message: err ? err.message : "gagal" }))
}

const getAnimeDetails = async (req, res) => {
    const { endpoint } = req.params

    let poster, title, genres, sysnopsis, status, studio, release_date, episode, director, casts, update_on, episode_list

    axios({
        url: `${baseUrl}/anime/${endpoint}`,
        method: "get", headers
    }).then((result) => {
        const $ = cheerio.load(result.data, null, false)
        poster = $(".thumb img").attr("src")
        title = $(".entry-title").text()
        genres = []
        $(".genxed a").each((_, el) => {
            genres.push({
                name: $(el).text(),
                endpoint: $(el).attr("href").replace("https://hqnime.com/genres", "").replace(/\//g, "")
            })
        })
        sysnopsis = $(".entry-content p").text().trim()
        status = $(".spe span:first").text().replace("Status: ", "")
        studio = $(".spe span:contains('Studio')").text().replace("Studio: ", "")
        release_date = $(".spe span:contains('Dirilis') time").text()
        episode = parseInt($(".spe span:contains('Episode')").text().replace("Episode: ", ""))
        director = $(".spe span:contains('Director')").text().replace("Director: ", "")
        casts = $(".spe span:contains('Casts')").text().replace("Casts: ", "")
        update_on = $(".spe span:contains('Diperbarui pada')").text().replace("Diperbarui pada: ", "")
        episode_list = []
        $(".eplister ul li").each((_, el) => {
            episode_list.push({
                endpoint: $(el).find("a").attr("href").replace("https://hqnime.com", "").replace(/\//g, ""),
                title: $(el).find(".epl-title").text(),
                release: $(el).find(".epl-date").text()
            })
        })
        episode_list.reverse()

        const AnimeDetails = {
            poster, title, genres, sysnopsis, status, studio, release_date, episode, director, casts, update_on, episode_list
        }

        res.json({
            message: "berhasil",
            results: AnimeDetails
        })

    }).catch((err) => res.json({ message: err ? err.message : "gagal" }))
}

const getAnimeVideos = async (req, res) => {
    const { endpoint } = req.params

    let title, videos, prev, next, episode
    axios({
        url: `${baseUrl}/${endpoint}`,
        method: "get", headers
    }).then((result) => {
        const $ = cheerio.load(result.data)

        title = $(".entry-title").text()
        videos = $(".player-embed iframe").attr("src")
        if (!videos) throw Error("Data tidak ada!")
        prev = $(".naveps .nvs:first a").attr("href").replace("https://hqnime.com", "").replace(/\//g, "")
        next = $(".naveps .nvs:last a").attr("href").replace("https://hqnime.com", "").replace(/\//g, "")
        episode = []
        $(".episodelist ul li").each((_, el) => {
            episode.push({
                link: $(el).find("a").attr("href").replace("https://hqnime.com", "").replace(/\//g, ""),
                title: $(el).find("h4").text(),
                get current() { return this.link === endpoint ? true : false }
            })
        })

        const AnimeVideos = {
            title,
            videos,
            prev: prev ? prev : null,
            next: next ? next : null,
            episode
        }

        res.json({
            message: "berhasil",
            results: AnimeVideos
        })

    }).catch((err) => res.json({ message: err ? err.message : "gagal" }))
}

const getAnimeBySort = async (req, res) => {
    const { page = 1, genre, status, order } = req.query
    const animeBySort = []
    const genres = genre.map((g) => `genre[]=${g}`)
    axios({
        url: `${baseUrl}/anime/?page=${page}&${genres.join("&")}&status=${status}&order=${order}`,
        method: "get", headers
    }).then((result) => {
        const $ = cheerio.load(result.data)
        let endpoint, poster, eps, type, title, rating

        $(".listupd .bs").each((_, el) => {
            endpoint = $(el).find("a.tip").attr("href").replace("https://hqnime.com/anime", "").replace(/\//g, "")
            poster = $(el).find("img").attr("src")
            eps = $(el).find("span.epx").text()
            type = $(el).find(".typez").text()
            title = $(el).find(".tt > h2").text()
            rating = parseFloat($(el).find(".ratingnya").text())

            animeBySort.push({ endpoint, poster, eps, type, title, rating })
        })

        res.json({
            message: "berhasil",
            results: animeBySort
        })
    }).catch((err) => res.json({ message: err ? err.message : "gagal" }))
}

const getJadwal = async(req, res) => {
    const jadwal = []
    let endpoint, poster, eps, title, day, listAnime
    axios({
        url: `${baseUrl}/jadwal`,
        method: "get", headers
    }).then((result) => {
        const $ = cheerio.load(result.data)
        $(".schedulepage").each((_, el) => {
            listAnime = []
            day = $(el).find("h3 span").text()
            $(el).find(".listupd .bsx").each((_, li) => {
                endpoint = $(li).find("a").attr("href").replace("https://hqnime.com/anime", "").replace(/\//g, "")
                poster = $(li).find("img").attr("src")
                eps = $(li).find(".Sub").text()
                title = $(li).find(".tt").text()
                listAnime.push({endpoint, poster, eps, title})
            })
            jadwal.push({ day, listAnime })
        })

        res.json({
            message: "berhasil",
            results: jadwal
        })
    }).catch((err) => res.json({ message: err ? err.message : "gagal" }))
}


module.exports = {
    getOnGoing,
    getCompleted,
    getSearch,
    getAnimeDetails,
    getAnimeVideos,
    getAnimeBySort,
    getJadwal
}