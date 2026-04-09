const pdfParse = require('pdf-parse')
const { generateInterviewReport, generateResumePdf, generateResume2Pdf } = require('../services/ai.services')
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterViewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

async function generateResume2PdfController(req, res) {
    let resumeText = "";
    let jobDescriptionText = "";
    let filename = "resume_ats.pdf";

    try {
        if (req.file) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = resumeContent.text
            jobDescriptionText = req.body.jobDescription || "Software Engineer"
        } else {
            const { interviewResumeId } = req.params;
            if (!interviewResumeId) {
                return res.status(400).json({ message: "No resume provided." })
            }
            const interviewReport = await interviewReportModel.findById(interviewResumeId);
            if (!interviewReport) {
                return res.status(404).json({
                    message: "Interview report not found."
                });
            }
            resumeText = interviewReport.resume;
            jobDescriptionText = interviewReport.jobDescription || "Software Engineer";
            filename = `resume_${interviewResumeId}.pdf`;
        }

        const result = await generateResume2Pdf({ resume: resumeText, jobDescription: jobDescriptionText })
        const pdfBuffer = result.pdfBuffer ? result.pdfBuffer : result;

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${filename}`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("generateResume2PdfController error:", error.message);
        console.error("Stack:", error.stack);
        res.status(500).json({ message: "Failed to generate ATS resume.", error: error.message });
    }
}

async function deleteInterviewReportsController(req, res) {
    const { interviewId } = req.params

    const deletedReport = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user.id })

    if (!deletedReport) {
        return res.status(404).json({
            message: "Interview report not found or you are not authorized to delete it."
        })
    }

    res.status(200).json({
        message: "Interview report deleted successfully.",
        deletedReport
    })
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    generateResume2PdfController,
    deleteInterviewReportsController
}