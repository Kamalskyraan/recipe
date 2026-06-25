import { Router } from "express";
import { sourceController } from "../controllers/src.controller";

const router = Router();

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
    title : "Drink More Water"
   
  }
}
*/
  sourceController.addUpdateTips(req, res);
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
  sourceController.getAllTips(req, res);
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
  sourceController.getRandomTips(req, res);
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
  sourceController.addUpdateCountry(req, res);
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
  sourceController.getCountry(req, res);
});

export default router;
