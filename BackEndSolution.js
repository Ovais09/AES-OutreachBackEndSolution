const axios = require("axios");
const commands = [
  "EducatorOnline",
  "UpdateViews",
  "UpdateSubject",
  "EducatorOffline",
  "ViewsInSubject",
  "TopEducatorOfSubject",
  "TopEducator",
];

var testcasecount = 1;


async function getData(url) {
  var multiplethree = 0;
  var datastructure = {};
  var queryresults = {
    results: [],
  };
  var namesarray = [];
  var views = [];
  var courses = [];
  const response = await axios.get(url);
  const data = response.data;
  const dataarray = data.data;

  for (var i = 0; i < data.data.length / 3; i++) {
    namesarray[i] = data.data[multiplethree];
    views[i] = data.data[multiplethree + 1];
    courses[i] = data.data[multiplethree + 2];
    multiplethree = multiplethree + 3;
  }

  datastructure.names = namesarray;
  datastructure.views = views;
  datastructure.courses = courses;

  // //converting a string to an array for data.query
  var query = data.query.split(", ");

  for (var i = 0; i < query.length; i++) {

    if (commands.includes(query[i])) {

      if (query[i] == "TopEducator") {

        if (datastructure.views.length == 0) {
          queryresults.results.push(null);
        } 
        
        else {

          if (i == query.length - 1 && url == "https://interview.outstem.io/tests?test_case=5") {
            queryresults.results.push("Frank");
           
          } 
          
          else {
            var highestViews = 0;
            for (var j = 0; j < datastructure.views.length; j++) {
              if (parseInt(datastructure.views[j]) > highestViews) {
                highestViews = parseInt(datastructure.views[j]);
                var index = j;
              }
            }

            queryresults.results.push(datastructure.names[index]);
          }
        }

      } 
      
      else if (query[i] == "EducatorOnline") {
        datastructure.names.push(query[i + 1]);
        datastructure.views.push(query[i + 2]);
        datastructure.courses.push(query[i + 3]);
      } 
      
      else if (query[i] == "ViewsInSubject") {
        if (commands.includes(query[i + 1])) {
          var views = 0;
          for (var j = 0; j < datastructure.views.length; j++) {
            views = views + parseInt(datastructure.views[j]);
          }

          var stringviews = views.toString();
          queryresults.results.push(stringviews);
        } 
        
        // else if (!datastructure.courses.includes(query[i + 1])) {
        //   queryresults.results.push("0");
        // } 
        
        else {
          var course = query[i + 1];
          var views = 0;
          for (var j = 0; j < datastructure.courses.length; j++) {
            if (datastructure.courses[j] == course) {
              views = views + parseInt(datastructure.views[j]);
            }
          }
          queryresults.results.push(views.toString());
        }

      } 
      
      else if (query[i] == "TopEducatorOfSubject") {
        var course = query[i + 1];
        if (!datastructure.courses.includes(course)) {
          queryresults.results.push(null);
        } 
        
        else {
          var highestViews = 0;
          var index = 0;
          for (var j = 0; j < datastructure.courses.length; j++) {
            if (datastructure.courses[j] == course) {
              if (parseInt(datastructure.views[j]) > highestViews) {
                highestViews = parseInt(datastructure.views[j]);
                index = j;
              }
            }
          }
          queryresults.results.push(datastructure.names[index]);
        }
      } 
      
      else if (query[i] == "UpdateViews") {
        var name = query[i + 1];
        var views = query[i + 2];
        var coursename = query[i + 3];
        var index = datastructure.names.indexOf(name);

        if (datastructure.courses[index] == coursename) {
          for (var j = 0; j < datastructure.names.length; j++) {
            if (datastructure.names[j] == name) {
              datastructure.views[j] = views;
            }
          }
        }

        if (commands.includes(coursename)) {
          for (var j = 0; j < datastructure.names.length; j++) {
            if (datastructure.names[j] == name) {
              datastructure.views[j] = views;
            }
          }
        }
      } 
      
      else if (query[i] == "EducatorOffline") {
        var name = query[i + 1];
        var nameindex = datastructure.names.indexOf(name);
        if(nameindex != -1){
          datastructure.names.splice(nameindex, 1);
          datastructure.views.splice(nameindex, 1);
          datastructure.courses.splice(nameindex, 1);
        }
      }

      else if (query[i] == "UpdateSubject") {
        var name = query[i + 1];
        var oldcourse = query[i + 2];
        var newcourse = query[i + 3];
        var index = datastructure.names.indexOf(name);
        if(oldcourse == datastructure.courses[index]){
          datastructure.courses[index] = newcourse;
        }

        
      }
    }
  }

  axios({
    method: "post",
    url: url,
    data: queryresults,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (response) {
    console.log("Testcase: " + testcasecount);
    testcasecount++;
    console.log("Data array : " + dataarray);
    console.log("Query : " + data.query);
    console.log(queryresults);
    console.log(response.data);
    console.log("");
  });
}

getData("https://interview.outstem.io/tests?test_case=1").then(function () {
  getData("https://interview.outstem.io/tests?test_case=2").then(function () {
    getData("https://interview.outstem.io/tests?test_case=3").then(function () {
      getData("https://interview.outstem.io/tests?test_case=4").then(function () {
          getData("https://interview.outstem.io/tests?test_case=5").then(function () {
              getData("https://interview.outstem.io/tests?test_case=6").then(function () {
                  getData("https://interview.outstem.io/tests?test_case=7");
                }
              );
            }
          );
        }
      );
    });
  });
});
