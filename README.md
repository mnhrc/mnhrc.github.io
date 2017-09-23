<img src="https://github.com/enlore/mnhrc.github.io/blob/master/images/logo.png?raw=true" /><img src="https://github.com/enlore/mnhrc.github.io/blob/master/images/c4n-logo.png?raw=true" style="text-align: right;"/>

ESL Map
=======

This project provides the power for the [ESL Map](http://www.eslmap.com).

It uses a simple Google form to gather the data, and gets the data for display
by calling the Google spreadsheet json endpoint. It's hosted here on Github
Pages, and requires only Github and Google accounts, both of which are free.

## Contributing

    # optionally, install handy webserver to use in dev
    npm install -g live-server

    # clone the repo
    git clone https://github.com/mnhrc/mnhrc.github.io

    # do work
    cd mnhrc.github.io
    live-server . # or your preferred method for hosting local frontend projects

Please open a Pull Request to submit your changes.

Please open an Issue (with screenshots and/or sample code and error messages)
to report bugs or other problems.

## Deploy for Your Locale

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
1. Locate and replace the center lat and lng values to define the initial
   center point of the map on load

As of this writing, all of these values are kept at the top of the
`map_controller.js` file for ease of access.

### Deploy to Host of Choice

The application is completely contained as a simple website and requires only
to be hosted as such.

For example, we host it for free on Github Pages.
