const express = require("express");
const router = express.Router()
const { 
    getOnGoing, 
    getCompleted, 
    getSearch, 
    getAnimeDetails, 
    getAnimeVideos, 
    getAnimeBySort, 
    getJadwal,
 } = require("../controller/apiController");

router.get("/", (req, res) => {
    res.json({
        status: 200,
        message:
            "API Work Gan!",
    });
})

router.get("/api/ongoing/:page?", getOnGoing)
router.get("/api/completed/:page?", getCompleted)
router.get("/api/search/:q/:page?", getSearch)
router.get("/api/anime/:endpoint", getAnimeDetails)
router.get("/api/nonton/:endpoint", getAnimeVideos)
router.get("/api/sort/:params?", getAnimeBySort)
router.get("/api/jadwal", getJadwal)

module.exports = router