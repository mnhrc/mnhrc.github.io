// Data =================================================================
var haveData = false;
var courses = [];

// Ask for data from the spreadsheet.
function startDataLoad(callback) {
  var url = 'http://69.167.174.162/kkite/test.php';

  $.getJSON(url, function (json) {
    onSpreadsheetData(json);
    callback();
  });
}

// This is called when the data loads from the spreadsheet.
function onSpreadsheetData(json) {
    var fields = ["organization", "address", "latitudeLongitude", "classAddress",
                  "coursesOffered", "startDate", "fee",
                  "description", "phoneNumber", "emailAddress", "websiteUrl",
                  "daysClassesOffered", "classtimes", "faithBased",
                  "classSchedule", "curriculumUsed"];
    var lastRow = {};
    json.feed.entry.forEach(function (row) {
        var newRow = {};

        // Empty cells are automatically filled based on the preceding row, but
        // ONLY if this row has the same organization as the last one.
        // Obviously it would be silly to auto-fill a row for one course with
        // values from a different organization's course!
        var org = row.gsx$organization.$t;
        var sameOrg = org === lastRow.organization || org === "";

        // Populate all the fields.
        fields.forEach(function (name) {
            var fieldName = name.toLowerCase();
            var value = row["gsx$" + fieldName].$t;
            if (row["gsx$" + fieldName] === undefined) {
                return;
            }
            if (sameOrg && value === "")
              value = lastRow[name];
            newRow[name] = value;
          });
        lastRow = newRow;

        // Only add the row to courses if it has been approved.
        if (row.gsx$status.$t == 'Approved') {
          courses.push(newRow);
        }
        });
    haveData = true;
  }

function listLocation(organization, classAddress) {
      var output = '<tr class="locations"><td class="location-list">'
            + '<div class="location-button" onclick="selectAddressFromList(\'' + classAddress + '\');">'
            + organization + '</div></td></tr>';
        $('#location_table tr:last').after(output);
}

// This is the function that figures out which courses to show on the map.
function getFilteredCourses() {

    // For each course, execute the function to determine whether we should
    // show it or not.
    return courses.filter(function (course) {

        // Filter by start date.
        var courseDate = course.startDate;
        if (courseDate !== "" && courseDate.indexOf('/') !== -1) {
          var filterInput = parseInt($("#start_date_menu").val());
          var filterEnd = moment().day(filterInput);
          var filterStart = moment();
          if (filterInput === 60) {
            filterStart = moment().add('d', 30);
          }
          if (filterInput === 90) {
            filterStart = moment().add('d', 60);
          }
          var courseCompare = moment(courseDate);
          if (courseCompare.valueOf() > filterEnd.valueOf() ||
              courseCompare.valueOf() < filterStart.valueOf()) {
            return false;
          }
        }

        // Filter by level.
        var level = $("#level_menu").val();
        if (level !== "" && course.coursesOffered.toLowerCase().indexOf(level.toLowerCase()) === -1) {
          return false;
        }

        // Filter by schedule.
        var schedule = $("#schedule_menu").val();
        if (schedule !== "" && course.classSchedule.toLowerCase().indexOf(schedule.toLowerCase()) === -1) {
          return false;
        }

        // Filter by cost.
        var fee = $("#cost_menu").val();
        var courseFee = course.fee.toLowerCase();
        if (fee !== courseFee.toLowerCase() && fee !== "") {
          if (courseFee !== "" && courseFee !== "free") {
            if (fee == "free") {
              return false;
            }
            var testFee = parseInt(courseFee);
            var filterFee = parseInt(fee);
            if (testFee >= filterFee) {
              return false;
            }
          }
        }

        // If we passed all those, this course is selected. Hooray!
        return true;
      });
  }


// Knockout bindings :( =======================================================

function ViewModel() {
    var self = this;

    self.organization = ko.observable();
    self.address = ko.observable();
    self.classAddress = ko.observable();
    self.phoneNumber = ko.observable();
    self.emailAddress = ko.observable();
    self.websiteUrl = ko.observable();
    self.coursesAtLocation = ko.observableArray();
    self.anySelected = ko.observable(false);
    self.description = ko.observable();
    self.faithBased = ko.observable();

    self.update = function (data) {
        self.organization(data.organization);
        self.address(data.address);
        self.classAddress(data.classAddress);
        self.emailAddress("<a href=mailto:" + data.emailAddress + ">" + data.emailAddress + "</a>");
        self.phoneNumber(data.phoneNumber);
        self.websiteUrl("<a href=" + data.websiteUrl + ">" + data.websiteUrl + "</a>");
        self.description(data.description);
        self.faithBased(data.faithBased);
        self.coursesAtLocation.removeAll();
        data.coursesAtLocation.forEach(function (course) {
            self.coursesAtLocation.push(course);
          });
      };
  }

var model = new ViewModel;
var selectedAddress = null;

function selectAddress(classAddress) {
  selectedAddress = classAddress;
  updatePopup();
}

function selectAddressFromList(classAddress) {
  selectedAddress = classAddress;
  toggleDetails();
  updatePopup();
}

function toggleDetails() {
  $("#location-popup").toggle();
  $("#location-list").toggle();
}

function updatePopup() {
  var matches = getFilteredCourses().filter(function (course) {
    return course.classAddress == selectedAddress;
  });
  if (matches.length !== 0) {
    model.update({
      organization: matches[0].organization,
      address: matches[0].address,
      classAddress: selectedAddress,
      phoneNumber: matches[0].phoneNumber,
      emailAddress: matches[0].emailAddress,
      websiteUrl: matches[0].websiteUrl,
      description: matches[0].description,
      faithBased: matches[0].faithBased,
      coursesAtLocation: matches
    });
    document.getElementById("location-popup").style.display = "block";
  }
}

function hidePopup() {
  document.getElementById("location-popup").style.display = "none";
}


// Map ========================================================================
google.maps.visualRefresh = true;
var map = undefined, geocoder;
var markers = [];

function insertPin(course) {
  var address = course.classAddress;
  var organization = course.organization;
  $("#location_table tbody").html("");
  listLocation(organization, address); // here

  if (course.latitudeLongitude === "") {
    geocoder.geocode(
      {"address": address},
      function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          makeMarker(results[0].geometry.location);
        } else {
          console.error("Geocoding failed: " + status);
        }
      });
  } else {
    var parts = course.latitudeLongitude.split(",");
    makeMarker(new google.maps.LatLng(Number(parts[0]), Number(parts[1])));
  }

  function makeMarker(location) {
    var marker = new google.maps.Marker({
      map: map,
      position: location,
      title: organization
    });
    markers.push(marker);
    google.maps.event.addListener(marker, "click", function() {
      selectAddress(address);
    });
  }
}

function initialize() {
    // Create the map.
    map = new google.maps.Map(document.getElementById("map-canvas"), {
        center: new google.maps.LatLng(36.16, 273.215),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    geocoder = new google.maps.Geocoder();

    ko.applyBindings(model);
    // declare jquery listeners
    $("select.filter_menu").change(updateMap);
    $("#aboutLink").click(function() {
        $("#about_window").toggle();
    });
    startDataLoad(updateMap);
}

function showHideLocations() {
    $("#location-list").toggle();
    $("#location-top").toggle();
    $("#navigation").toggle();
}

function hideAbout() {
    $("#about_window").toggle();
}

function updateMap() {
    // Remove any old pins from the map.
    markers.forEach(function (marker) {
        marker.setMap(null);
    });
    markers = [];

    // Insert new pins.
    var pinAddresses = [];
    getFilteredCourses().forEach(function (course) {
        if (pinAddresses.indexOf(course.classAddress) === -1) {
            pinAddresses.push(course.classAddress);
            insertPin(course);
        }
    });

    // If the popup is visible, we'll want to update that too.
    updatePopup();
    hidePopup();
}

google.maps.event.addDomListener(window, 'load', initialize);
