const express = require('express');
const interviewRouter = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')

interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

interviewRouter.delete("/:interviewId", authMiddleware.authUser, interviewController.deleteInterviewReportsController)


interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

interviewRouter.post("/resume2/pdf/direct", authMiddleware.authUser, upload.single("resume"), interviewController.generateResume2PdfController)

interviewRouter.post("/resume2/pdf/:interviewResumeId", authMiddleware.authUser, interviewController.generateResume2PdfController)

module.exports = interviewRouter