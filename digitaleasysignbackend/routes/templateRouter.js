const express = require("express");
const router = express.Router();

const { addTemplate } = require("../controller/template/addTemplate");
const { getTemplates } = require("../controller/template/getTemplates");
const { getTemplateById } = require("../controller/template/getTemplateById");
const { updateTemplate } = require("../controller/template/updateTemplate");
const { deleteTemplate } = require("../controller/template/deleteTemplate");

/**This routes for add template */
router.post("/addTemplate", addTemplate);

/**This routes for get template */
router.post("/getTemplates", getTemplates);

/**This routes for get template by id */
router.post("/:id", getTemplateById);

/***This routes for update template */
router.put("/updateTemplate", updateTemplate);

/**This routes for delete template */
router.delete("/deleteTemplate/:id", deleteTemplate);

module.exports = router;
