![Metro Nashville Human Relations Commission logo](https://github.com/enlore/mnhrc.github.io/blob/master/images/logo.png?raw=true)

esl-nashville
=============

This project provides the power for the [ESL Map](http://www.eslmap.com).

It uses a simple google form to gather the data, and gets the data for display
by calling the google spreadsheet json endpoint.

## Notes

See https://developers.google.com/api-client-library/javascript/features/authentication](GAPI docs on authentication).

Data hosted as Google Sheet. Collected from community via Google Form.

GAPI client library used to directly access google spreadsheet. GAPI API key
required. Not using OAuth, as users can access and submit the data anonymously.

## Deployment Steps

If you'd like to repurpose this app for your area, you'll need to make changes
to the client code and provide your own infrastructure (Google Form, Google
Sheet, hosting).

### Enable Google Sheets API

#### Requirements

* Google account

#### Steps

1. Go to [Google Developers Console](https://console.developers.google.com)
1. Go to Library (left sidebar nav)
1. Search for Sheets in the API library and open the link to the Google Sheets
   API console
1. Enable the Sheets API (see the Enable button)
1. Go to Credentials (left nav)
1. Click Create Credentials and create an API key
1. Copy the API key and close the dialogue
1. Click on the name of the API key in the table to view the config screen for
   the key
1. Under the _Key restriction_ heading, select the _HTTP Referres (web sites)_
   option
1. Add the domain on which you'll be hosting the app (and from which the client
   api library will be making ajax requests)
 1. Optionally, add your local dev address (`http://localhost:8080` or what
    have you)
 1. You should remove that dev alias after you finish working and deploy

You should now have an API key scoped to the domains on which the client code
will run, and you should have enabled the Google Sheets API for your account.

### Create Google Form and Google Sheet

#### Requirements

* Google account

#### Steps

Rather than describe the schema of the form and resultant spreadsheet, link to
examples here.


### Update Client Code

#### Requirements

* API key from [Enable Sheets API](#enable-google-sheets-api) section
* Spreadsheet ID of spreadsheet created in [Create Google Form and Google
  Sheet](#create-google-form-and-google-sheet) section

#### Steps

1. Locate and replace the API key in the client codebase
1. Locate and replace spreadsheet ID in client codebase

