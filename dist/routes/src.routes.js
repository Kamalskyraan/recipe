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
      status: "active or inactive",
      tip_img : "1",
      title : "Drink More Water",
      desc : "Bananas ripen quickly because they release a
   natural gas called ethylene, especially from the
  stem. By wrapping the stem, you can slow down
  this process and keep your bananas fresh for a
  longer time.",
    tips : "Bananas ripen quickly because they release a
   natural gas called ethylene, especially from the
  stem. By wrapping the stem, you can slow down
  this process and keep your bananas fresh for a
  longer time..."
     
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
exports.default = router;
