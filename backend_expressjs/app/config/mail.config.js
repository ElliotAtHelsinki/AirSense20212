const nodeMailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const { google } = require('googleapis')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const systemEmail = process.env.SYSTEM_EMAIL
const systemClientId = process.env.SYSTEM_CLIENT_ID
const systemClientSecret = process.env.SYSTEM_CLIENT_SECRET
const redirectUrl = process.env.REDIRECT_URL
const refreshToken = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(systemClientId, systemClientSecret, redirectUrl)
oAuth2Client.setCredentials({ refresh_token: refreshToken })

const parseResetPassTemplate = async (redirectLink, newPass) => {
  const contentResetPassHTML = await readFileAsync('app/assets/resetPass.html')
  return handlebars.compile(contentResetPassHTML.toString())({
    redirectLink,
    newPass,
  })
}

const parseActivateAccountTemplate = async (redirectLink) => {
  const contentActivateAccountHTML = await readFileAsync('app/assets/activateAccount.html')
  return handlebars.compile(contentActivateAccountHTML.toString())({
    redirectLink,
  })
}

const sendMail = async (to, subject, htmlTemplate) => {
  const accessToken = await oAuth2Client.getAccessToken()
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: systemEmail,
      clientId: systemClientId,
      clientSecret: systemClientSecret,
      refreshToken,
      accessToken,
    },
  })
  const options = {
    from: systemEmail,
    to,
    subject,
    html: htmlTemplate,
  }
  return transporter.sendMail(options)
}
module.exports = {
  sendMail,
  parseResetPassTemplate,
  parseActivateAccountTemplate
}
