"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const src_controller_1 = require("../controllers/src.controller");
const router = (0, express_1.Router)();
router.post("/add-tips", (req, res) => {
    /*
  #swagger.tags = ['2.Tips']
  #swagger.summary = 'Create or Update Tip'
  
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      id: 1,
      image: '1',
      status: 'active',
      translations: [
        {
          lang_code: 'en',
          desc: 'Drink more water'
        },
        {
          lang_code: 'ta',
          desc: 'அதிக தண்ணீர் குடிக்கவும்'
        }
      ]
    }
  }
  */
    src_controller_1.sourceController.addUpdateTips(req, res);
});
router.post("/get-tips", (req, res) => {
    /*
  #swagger.tags = ['2.Tips']
  #swagger.summary = 'Get All Tips'
  
  #swagger.parameters['body'] = {
    in: 'body',
    required: false,
    schema: {
      id: 1,
      status: 'active',
      lang_code: 'ta'
    }
  }
  */
    src_controller_1.sourceController.getAllTips(req, res);
});
router.post("/get-random-tips", (req, res) => {
    /*
  #swagger.tags = ['2.Tips']
  #swagger.summary = 'Get Random Tips Based On date'
  
  #swagger.parameters['body'] = {
    in: 'body',
    required: false,
    schema: {
      id: 1,
      c_date : '2026-06-01',
      lang_code: 'ta'
    }
  }
  */
    src_controller_1.sourceController.getRandomTips(req, res);
});
// country
router.post("/add-country", (req, res) => {
    /*
  #swagger.tags = ['3.Country']
  #swagger.summary = 'Create or Update Country'
  
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      id: 1,
      image: '1',
      status: 'active',
     name : 'India'
    }
  }
  */
    src_controller_1.sourceController.addUpdateCountry(req, res);
});
router.post("/get-country", (req, res) => {
    /*
  #swagger.tags = ['3.Country']
  #swagger.summary = 'Get All Countries'
  
  #swagger.parameters['body'] = {
    in: 'body',
    required: false,
    schema: {
      id: 1,
      status: 'active',
      lang_code: 'ta'
    }
  }
  */
    src_controller_1.sourceController.getCountry(req, res);
});
exports.default = router;
