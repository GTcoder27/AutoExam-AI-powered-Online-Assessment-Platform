import express from "express";
import {generate_using_pdf,generate_using_topic,generate_using_ocr} from "../model/generateQuestions.js";


const router = express.Router();

router.post("/using_pdf", generate_using_pdf);   
router.post("/using_topic", generate_using_topic);
router.post("/using_ocr", generate_using_ocr);







export default router;





