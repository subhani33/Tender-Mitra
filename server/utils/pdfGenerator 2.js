const PDFDocument = require('pdfkit');

/**
 * Generate a PDF document for a bid
 * @param {Object} bid - The bid object with populated tender and user
 * @returns {Promise<Buffer>} - The PDF as a buffer
 */
exports.generatePdf = async(bid) => {
    return new Promise((resolve, reject) => {
        try {
            // Create a PDF document
            const doc = new PDFDocument({
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
                size: 'A4',
                info: {
                    Title: `Bid Proposal - ${bid.title}`,
                    Author: 'EdtoDo Technovations LLP',
                    Subject: 'Tender Bid Proposal',
                    Keywords: 'tender, bid, proposal',
                    CreationDate: new Date()
                }
            });

            // Create a buffer to store the PDF
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(chunks);
                resolve(pdfBuffer);
            });

            // Add logo and header
            addHeader(doc, bid);

            // Add tender information
            addTenderInfo(doc, bid);

            // Add company information
            addCompanyInfo(doc, bid);

            // Add proposal text
            addProposalText(doc, bid);

            // Add financial details
            if (bid.financialDetails && bid.financialDetails.bidAmount) {
                addFinancialDetails(doc, bid);
            }

            // Add team information
            if (bid.team && bid.team.length > 0) {
                addTeamInfo(doc, bid);
            }

            // Add checklist status
            if (bid.checklist && bid.checklist.length > 0) {
                addChecklist(doc, bid);
            }

            // Add footer
            addFooter(doc, bid);

            // Finalize the PDF
            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Add header with logo and title
 */
function addHeader(doc, bid) {
    // Add logo image if available
    // doc.image('path/to/logo.png', 50, 45, { width: 50 });

    // Add title
    doc.fontSize(22)
        .fillColor('#1A2A44')
        .font('Helvetica-Bold')
        .text('BID PROPOSAL', { align: 'center' })
        .moveDown(0.5);

    // Add reference number
    doc.fontSize(14)
        .fillColor('#666')
        .text(`Reference: ${bid.reference}`, { align: 'center' })
        .moveDown(1);

    // Add horizontal line
    doc.moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke('#D4AF37')
        .moveDown(1);
}

/**
 * Add tender information section
 */
function addTenderInfo(doc, bid) {
    doc.fontSize(16)
        .fillColor('#1A2A44')
        .font('Helvetica-Bold')
        .text('TENDER INFORMATION', { underline: true })
        .moveDown(0.5);

    const tender = bid.tender;

    doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#333');

    // Tender details table
    const tableData = [
        ['Title', tender.title || 'N/A'],
        ['Reference Number', tender.referenceNumber || 'N/A'],
        ['Department', tender.department || 'N/A'],
        ['Deadline', formatDate(tender.deadline) || 'N/A'],
        ['Status', tender.status || 'N/A'],
        ['Category', tender.category || 'N/A'],
        ['Value', tender.value ? `₹${formatCurrency(tender.value)}` : 'N/A']
    ];

    // Render table
    renderTable(doc, tableData, 50, doc.y, [150, 350]);

    // Description
    if (tender.description) {
        doc.moveDown(1)
            .font('Helvetica-Bold')
            .text('Description:')
            .font('Helvetica')
            .text(tender.description, {
                width: doc.page.width - 100,
                align: 'justify'
            });
    }

    doc.moveDown(2);
}

/**
 * Add company information section
 */
function addCompanyInfo(doc, bid) {
    doc.fontSize(16)
        .fillColor('#1A2A44')
        .font('Helvetica-Bold')
        .text('BIDDER INFORMATION', { underline: true })
        .moveDown(0.5);

    doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#333');

    // Company details
    const companyDetails = bid.companyDetails || {};
    const user = bid.user || {};

    // Bidder details table
    const tableData = [
        ['Company Name', companyDetails.name || 'N/A'],
        ['Contact Person', `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'],
        ['Email', user.email || 'N/A'],
        ['Registration No.', companyDetails.registrationNumber || 'N/A'],
        ['Tax Number', companyDetails.taxNumber || 'N/A'],
        ['Year Established', companyDetails.yearEstablished || 'N/A'],
        ['Employee Count', companyDetails.employeeCount || 'N/A']
    ];

    // Render table
    renderTable(doc, tableData, 50, doc.y, [150, 350]);

    // Address
    if (companyDetails.address) {
        doc.moveDown(1)
            .font('Helvetica-Bold')
            .text('Address:')
            .font('Helvetica')
            .text(companyDetails.address);
    }

    doc.moveDown(2);
}

/**
 * Add proposal text section
 */
function addProposalText(doc, bid) {
    // Check for new page
    if (doc.y > doc.page.height - 150) {
        doc.addPage();
    }

    doc.fontSize(16)
        .fillColor('#1A2A44')
        .font('Helvetica-Bold')
        .text('PROPOSAL', { underline: true })
        .moveDown(0.5);

    // Add the proposal text if available
    if (bid.proposalText) {
        doc.fontSize(12)
            .font('Helvetica')
            .fillColor('#333')
            .text(bid.proposalText, {
                width: doc.page.width - 100,
                align: 'justify'
            });
    } else {
        doc.fontSize(12)
            .font('Helvetica')
            .fillColor('#333')
            .text('No proposal text provided.');
    }

    doc.moveDown(2);

    // Technical approach
    if (bid.technicalApproach) {
        doc.fontSize(14)
            .fillColor('#1A2A44')
            .font('Helvetica-Bold')
            .text('Technical Approach', { underline: true })
            .moveDown(0.5);

        const { methodology, timeline, riskManagement, qualityAssurance } = bid.technicalApproach;

        if (methodology) {
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#333')
                .text('Methodology:')
                .font('Helvetica')
                .text(methodology, {
                    width: doc.page.width - 100,
                    align: 'justify'
                })
                .moveDown(0.5);
        }

        if (timeline) {
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#333')
                .text('Timeline:')
                .font('Helvetica')
                .text(timeline, {
                    width: doc.page.width - 100,
                    align: 'justify'
                })
                .moveDown(0.5);
        }

        if (riskManagement) {
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#333')
                .text('Risk Management:')
                .font('Helvetica')
                .text(riskManagement, {
                    width: doc.page.width - 100,
                    align: 'justify'
                })
                .moveDown(0.5);
        }

        if (qualityAssurance) {
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#333')
                .text('Quality Assurance:')
                .font('Helvetica')
                .text(qualityAssurance, {
                    width: doc.page.width - 100,
                    align: 'justify'
                });
        }

        doc.moveDown(2);
    }
}

/**
 * Add financial details section
 */
function addFinancialDetails(doc, bid) {
    // Check for new page
    if (doc.y > doc.page.height - 200) {
        doc.addPage();
    }

    doc.fontSize(16)
        .fillColor('#1A2A44')
        .font('Helvetica-Bold')
        .text('FINANCIAL DETAILS', { underline: true })
        .moveDown(0.5);

    const financialDetails = bid.financialDetails || {};

    doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#333');

    // Financial summary
    const tableData = [
        ['Bid Amount', financialDetails.bidAmount ? `₹${formatCurrency(financialDetails.bidAmount)}` : 'N/A'],
        ['Currency', financialDetails.currency || 'INR'],
        ['Validity Period', financialDetails.validityPeriod ? `${financialDetails.validityPeriod} days` : 'N/A']
    ];

    // Render table
    renderTable(doc, tableData, 50, doc.y, [150, 350]);

    // Payment terms
    if (financialDetails.paymentTerms) {
        doc.moveDown(1)
            .font('Helvetica-Bold')
            .text('Payment Terms:')
            .font('Helvetica')
            .text(financialDetails.paymentTerms);
    }

    // Breakdown items if available
    if (financialDetails.breakdownItems && financialDetails.breakdownItems.length > 0) {
        doc.moveDown(1.5)
            .font('Helvetica-Bold')
            .text('Cost Breakdown:')
            .moveDown(0.5);

        // Breakdown table headers
        const breakdownHeaders = ['Description', 'Quantity', 'Unit', 'Amount (₹)', 'Total (₹)'];
        const breakdownWidths = [200, 70, 70, 100, 100];

        // Create headers row
        doc.font('Helvetica-Bold')
            .fontSize(11);

        let tableXPos = 50;
        breakdownHeaders.forEach((header, i) => {
            doc.text(header, tableXPos, doc.y, { width: breakdownWidths[i], align: 'left' });
            tableXPos += breakdownWidths[i];
        });

        doc.moveDown(0.5);

        // Draw a line under the headers
        doc.moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke('#aaa');

        doc.moveDown(0.5);

        // Render each breakdown item
        doc.font('Helvetica')
            .fontSize(11);

        let totalAmount = 0;

        financialDetails.breakdownItems.forEach((item) => {
            const quantity = item.quantity || 1;
            const amount = item.amount || 0;
            const total = quantity * amount;
            totalAmount += total;

            let tableXPos = 50;
            [
                item.description || 'N/A',
                quantity.toString(),
                item.unit || 'Unit',
                formatCurrency(amount),
                formatCurrency(total)
            ].forEach((text, i) => {
                doc.text(text, tableXPos, doc.y, { width: breakdownWidths[i], align: i === 0 ? 'left' : 'right' });
                tableXPos += breakdownWidths[i];
            });

            doc.moveDown(0.5);
        });

        // Draw a line above the total
        doc.moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke('#aaa');

        doc.moveDown(0.5);

        // Render total
        doc.font('Helvetica-Bold');

        let summaryXPos = 50;
        ['Total', '', '', '', formatCurrency(totalAmount)].forEach((text, i) => {
            const align = i === 0 ? 'left' : (i === 4 ? 'right' : 'center');
            doc.text(text, summaryXPos, doc.y, { width: breakdownWidths[i], align });
            summaryXPos += breakdownWidths[i];
        });
    }

    doc.moveDown(2);
}

/**
 * Add team information section
 */
function addTeamInfo(doc, bid) {
    // Check for new page
    if (doc.y > doc.page.height - 200) {
        doc.addPage();
    }

    doc.fontSize(16)
        .fillColor('#1A2A44')
        .font('Helvetica-Bold')
        .text('PROJECT TEAM', { underline: true })
        .moveDown(0.5);

    // Team table headers
    const teamHeaders = ['Name', 'Role', 'Experience (Years)', 'Qualifications'];
    const teamWidths = [150, 100, 100, 150];

    // Create headers row
    doc.font('Helvetica-Bold')
        .fontSize(11);

    let xPos = 50;
    teamHeaders.forEach((header, i) => {
        doc.text(header, xPos, doc.y, { width: teamWidths[i], align: 'left' });
        xPos += teamWidths[i];
    });

    doc.moveDown(0.5);

    // Draw a line under the headers
    doc.moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke('#aaa');

    doc.moveDown(0.5);

    // Render each team member
    doc.font('Helvetica')
        .fontSize(11);

    bid.team.forEach((member) => {
        const qualifications = Array.isArray(member.qualifications) ?
            member.qualifications.join(', ') :
            (member.qualifications || 'N/A');

        let xPos = 50;
        [
            member.name || 'N/A',
            member.role || 'N/A',
            (member.experience || 'N/A').toString(),
            qualifications
        ].forEach((text, i) => {
            doc.text(text, xPos, doc.y, {
                width: teamWidths[i],
                align: 'left',
                ellipsis: true
            });
            xPos += teamWidths[i];
        });

        doc.moveDown(1);
    });

    doc.moveDown(1);
}

/**
 * Add checklist status section
 */
function addChecklist(doc, bid) {
    // Check for new page
    if (doc.y > doc.page.height - 150) {
        doc.addPage();
    }

    doc.fontSize(16)
        .fillColor('#1A2A44')
        .font('Helvetica-Bold')
        .text('SUBMISSION CHECKLIST', { underline: true })
        .moveDown(0.5);

    doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#333');

    // Progress
    doc.text(`Completion: ${bid.progress || 0}%`)
        .moveDown(1);

    // Render a simple checklist
    bid.checklist.forEach((item, index) => {
        const checkmark = item.completed ? '✓' : '☐';
        const required = item.requiredForSubmission ? ' (Required)' : '';
        const category = item.category ? ` [${item.category}]` : '';

        doc.text(`${checkmark} ${item.item}${required}${category}`, {
            continued: false,
            width: doc.page.width - 100
        });

        doc.moveDown(0.5);
    });

    doc.moveDown(2);
}

/**
 * Add footer with page numbers
 */
function addFooter(doc, bid) {
    const totalPages = doc.bufferedPageRange().count;
    let currentPage = 1;

    // Add footer to each page
    for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);

        // Draw footer line
        doc.moveTo(50, doc.page.height - 50)
            .lineTo(doc.page.width - 50, doc.page.height - 50)
            .stroke('#D4AF37');

        // Add page number
        doc.fontSize(10)
            .fillColor('#666')
            .text(
                `Page ${currentPage} of ${totalPages}`,
                50,
                doc.page.height - 40, { align: 'center', width: doc.page.width - 100 }
            );

        // Add bid reference and date
        doc.text(
            `Bid Ref: ${bid.reference} | Generated: ${formatDate(new Date())}`,
            50,
            doc.page.height - 30, { align: 'center', width: doc.page.width - 100 }
        );

        currentPage++;
    }
}

/**
 * Helper function to render a simple table
 */
function renderTable(doc, tableData, x, y, columnWidths) {
    const startY = y;
    const lineHeight = 20;

    // Render table rows
    tableData.forEach((row, index) => {
        const rowY = startY + (index * lineHeight);

        // First column (field name)
        doc.font('Helvetica-Bold')
            .text(row[0], x, rowY, { width: columnWidths[0] });

        // Second column (field value)
        doc.font('Helvetica')
            .text(row[1], x + columnWidths[0], rowY, { width: columnWidths[1] });
    });

    // Move document cursor after the table
    doc.moveDown(tableData.length + 0.5);
}

/**
 * Format date to a readable string
 */
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Format currency
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    }).format(value);
}