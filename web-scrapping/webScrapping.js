// const axios = require("axios");

// (async () => {
//     const { data } = await axios.get("https://udyamregistration.gov.in/UdyamRegistration.aspx");
//     console.log(data);
// })();

// --------------------------------------------------------------------------------------
// const axios = require("axios");
// const cheerio = require("cheerio");

// async function scrape() {
//     const { data } = await axios.get("https://udyamregistration.gov.in/UdyamRegistration.aspx");

//     const $ = cheerio.load(data);

//     console.log($("title").text());
// }

// scrape();
// ---------------------------------------------------------------------------------------------
// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// const url = 'https://udyamregistration.gov.in/UdyamRegistration.aspx';

// async function scrapeFields() {
//     const { data: html } = await axios.get(url, {
//         headers: { 'User-Agent': 'Mozilla/5.0' }
//     });

//     const $ = cheerio.load(html);
//     const form = $('form').first();

//     const fields = [];

//     form.find('input, select, textarea').each((_, el) => {
//         const tag = $(el);
//         const id = tag.attr('id');

//         // skip ASP.NET internals
//         if (!id || id.startsWith('__')) return;

//         fields.push({
//             tag: el.tagName,
//             id,
//             name: tag.attr('name'),
//             type: tag.attr('type') || el.tagName,
//             placeholder: tag.attr('placeholder') || null,
//             maxlength: tag.attr('maxlength') || null,
//             pattern: tag.attr('pattern') || null,
//             required: tag.attr('required') !== undefined,
//             onkeypress: tag.attr('onkeypress') || null,
//             onblur: tag.attr('onblur') || null,
//             className: tag.attr('class') || null,
//         });
//     });

//     // attach label text via 'for' attribute
//     fields.forEach((f) => {
//         if (f.id) {
//             const label = form.find(`label[for="${f.id}"]`).text().trim();
//             f.label = label || null;
//         }
//     });

//     console.log(JSON.stringify(fields, null, 2));
//     fs.writeFileSync('scraped_fields.json', JSON.stringify(fields, null, 2));
//     console.log(`\nExtracted ${fields.length} fields → scraped_fields.json`);
// }

// scrapeFields().catch((err) => console.error('Scrape failed:', err.message));
// _______________________________________________________________________________________

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://udyamregistration.gov.in/UdyamRegistration.aspx';

async function scrapeFields() {
    const { data: html } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(html);
    const form = $('form').first();

    const fields = [];

    // 1. Extract input/select/textarea fields
    form.find('input, select, textarea').each((_, el) => {
        const tag = $(el);
        const id = tag.attr('id');
        if (!id || id.startsWith('__')) return;

        fields.push({
            tag: el.tagName,
            id,
            name: tag.attr('name'),
            type: tag.attr('type') || el.tagName,
            placeholder: tag.attr('placeholder') || null,
            maxlength: tag.attr('maxlength') || null,
            required: tag.attr('required') !== undefined,
            className: tag.attr('class') || null,
            label: null,
            validators: [],
        });
    });

    // 2. Try to resolve label text: check label[for], then walk up to
    //    nearest ancestor and grab preceding text/label content
    fields.forEach((f) => {
        const el = form.find(`#${f.id}`);

        // direct label[for=id]
        let label = form.find(`label[for="${f.id}"]`).text().trim();

        // fallback: look for a <label> inside the same parent container
        if (!label) {
            const container = el.closest('div, td, li');
            label = container.find('label').first().text().trim();
        }

        f.label = label || null;
    });

    // 3. Extract ASP.NET Validator controls (RequiredFieldValidator,
    //    RegularExpressionValidator etc.) and match to their target field
    //    via 'controltovalidate'
    $('span[id*="Validator"], span[controltovalidate]').each((_, el) => {
        const v = $(el);
        const controlToValidate = v.attr('controltovalidate');
        if (!controlToValidate) return;

        const validatorInfo = {
            validatorId: v.attr('id'),
            errorMessage: v.attr('errormessage') || v.text().trim() || null,
            validationExpression: v.attr('validationexpression') || null,
            evaluationFunction: v.attr('evaluationfunction') || null,
            type: v.attr('id')?.match(/Validator/) ? v.attr('id') : null,
        };

        const target = fields.find(
            (f) => f.id === controlToValidate || f.id.endsWith(controlToValidate)
        );
        if (target) {
            target.validators.push(validatorInfo);
        }
    });

    console.log(JSON.stringify(fields, null, 2));
    fs.writeFileSync('scraped_fields.json', JSON.stringify(fields, null, 2));
    console.log(`\nExtracted ${fields.length} fields → scraped_fields.json`);
}

scrapeFields().catch((err) => console.error('Scrape failed:', err.message));