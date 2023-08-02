#!/bin/env bash
export DEBUG="*, -follow-redirects, -express:*, -nodemon*,-[nodemon]*, -body-parser:*, -morgan:*, -cookie-parser:*, -multer,-puppeteer:*"
npm run dev