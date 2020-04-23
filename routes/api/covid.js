const express = require('express')
const router = express.Router()
const requestHelper = require('../utils/httpRequestHelper')
const objectHelper = require('../utils/objectHelper')
const fileHelper = require('../utils/fileHelper')

const RAPID_API_URL = 'coronavirus-monitor.p.rapidapi.com'
const RAPID_API_HEADER_URL = RAPID_API_URL
const RAPID_API_HEADER_KEY = process.env.RAPIDAPISECRETKEY
const RAPID_API_FOLDER = '/coronavirus/'

const COUNTRY_LATEST_STATS = 'latest_stat_by_country.php'
const HISTORY_COUNTRY = 'cases_by_particular_country.php'
const WORLD_STATS = 'cases_by_country.php'

const PH_PATIENT_LIST = 'cases/'

const RAPID_API_SOURCE_OPTIONS = requestHelper.buildOptions(
  RAPID_API_URL,
  RAPID_API_FOLDER,
  {
    "Accept": requestHelper.REQUEST_RETURN_JSON,
    "x-rapidapi-host": RAPID_API_HEADER_URL,
    "x-rapidapi-key": RAPID_API_HEADER_KEY
  },
)

const HEROKU_API_URL = 'coronavirus-ph-api.herokuapp.com'
const HEROKU_SOURCE_OPTIONS = requestHelper.buildOptions(
  HEROKU_API_URL,
  '/',
  {
    "Accept": requestHelper.REQUEST_RETURN_JSON,
  },
)

// set to homepage API documentation
router.get('/', (req, res, next) => {
  res.json({
    'connected': true
  })
})

// latest stats by country
router.get('/country_latest_stats/:id', (req, res, next) => {
  let options = objectHelper.copyObjectContents(RAPID_API_SOURCE_OPTIONS);
  let filename = 'country_latest_stats.json'
  options.path += COUNTRY_LATEST_STATS + '?country=' + req.params.id

  const apiCallback = function (statusCode, data) {
    if (statusCode == requestHelper.REQUEST_SUCCESS) {
      if (data["latest_stat_by_country"].length >= 1) {
        fileHelper.saveContentToFile(data, filename);
      }
      res.json(fileHelper.readFileContent(filename)["latest_stat_by_country"][0]);
    } else {
      res.json({
        status: false,
        message: data.message
      });
    }
  }
  requestHelper.apiRequestWrapper(options, apiCallback)
})

// latest world stats
router.get('/world_stats', (req, res, next) => {
  let options = objectHelper.copyObjectContents(RAPID_API_SOURCE_OPTIONS);
  let filename = 'world_stats.json'
  options.path += WORLD_STATS;

  const apiCallback = function (statusCode, data) {
    if (statusCode == requestHelper.REQUEST_SUCCESS) {
      if (data["countries_stat"].length >= 1) {
        fileHelper.saveContentToFile(data, filename);
      }
      res.json(fileHelper.readFileContent(filename)["countries_stat"]);
    } else {
      res.json({
        status: false,
        message: data.message
      });
    }
  }
  requestHelper.apiRequestWrapper(options, apiCallback)
})

// country history
router.get('/country_history/:id', (req, res, next) => {
  let options = objectHelper.copyObjectContents(RAPID_API_SOURCE_OPTIONS);
  let filename = 'country_history.json'
  options.path += HISTORY_COUNTRY + '?country=' + req.params.id

  const apiCallback = function (statusCode, data) {
    if (statusCode == requestHelper.REQUEST_SUCCESS) {
      if (data["stat_by_country"].length >= 1) {
        fileHelper.saveContentToFile(data, filename);
      }
      res.json(fileHelper.readFileContent(filename)["stat_by_country"]);
    } else {
      res.json({
        status: false,
        message: data.message
      });
    }
  }
  requestHelper.apiRequestWrapper(options, apiCallback)
})

// PH patient list
router.get('/ph_patient_list', (req, res, next) => {
  let options = objectHelper.copyObjectContents(HEROKU_SOURCE_OPTIONS)
  let filename = 'ph_patient_list.json'
  options.path += PH_PATIENT_LIST

  console.log(options)
  const apiCallback = function (statusCode, data) {
    if (statusCode == requestHelper.REQUEST_SUCCESS) {
      if (data["data"].length >= 1) {
        fileHelper.saveContentToFile(data, filename);
      }
      res.json(fileHelper.readFileContent(filename)["data"]);
    } else {
      res.json({
        status: false,
        message: data.message
      });
    }
  }
  requestHelper.apiRequestWrapper(options, apiCallback)
})


module.exports = router 
