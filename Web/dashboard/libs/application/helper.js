/* Exploring sentiment in Edinburgh using social media on cloud resources
 Authors: Andres Chaves, Diego Montufar, Ilkan Esiyok, Gustavo Carrion, Clifford Siu
 ID’s: 706801, 661608, 616394,667597, 591158
 Helper.js: Helper class for processing the output from the queries and translate into useful data for highcharts or foamtree
*/

var languagesList = {};
  languagesList['it'] = 'Italy';
  languagesList['sv'] = 'Swedish';
  languagesList['tr'] = 'Turkish';
  languagesList['pt'] = 'Portugal';
  languagesList['de'] = 'Germany';
  languagesList['fr'] = 'France';
  languagesList['ja'] = 'Japan';
  languagesList['es'] = 'Spain';
  languagesList['en-GB'] = 'United Kingdom';
  languagesList['en-gb'] = 'United Kingdom';
  languagesList['en'] = 'United Kingdom';
  languagesList['xx-lc'] = 'Born elsewhere';
  languagesList['da'] = 'Denmark';
  languagesList['nl'] = 'Netherlands';
  languagesList['pl'] = 'Poland';
  languagesList['fi'] = 'Finland';
  languagesList['ko'] = 'Korea';
  languagesList['ar'] = 'Arabic(s)';
  languagesList['ca'] = 'Catalan';
  languagesList['no'] = 'Norway';
  languagesList['ru'] = 'Russia';
  languagesList['cs'] = 'Czech Republic';
  languagesList['th'] = 'Thailand';
  languagesList['id'] = 'Indonesia';
  languagesList['vi'] = 'Vietnam';
  languagesList['el'] = 'Greece';
  languagesList['zh-Hans'] = 'China (Simp)';
  languagesList['zh-cn'] = 'China';
  languagesList['en-in'] = 'Ireland';
  languagesList['ro'] = 'Romania';
  languagesList['ga'] = 'Ireland';
  languagesList['zh-tw'] = 'Taiwan';
  languagesList['hu'] = 'Hungary';

function getLanguageName(id){
  return languagesList[id];
};

function keySorter(linechartdata, variable){
      
        keys = [];
        var result = []
        var sorted_linechartdata = {};

        for(var k in linechartdata){
          if(linechartdata.hasOwnProperty(k)){
            keys.push(k);
          }
        }
        keys.sort();

        jQuery.each(keys, function(i, k){
          sorted_linechartdata[k] = linechartdata[k];
        });

        for(var k in sorted_linechartdata){
          result.push(sorted_linechartdata[k][variable]);
        }
	return result;

}


var Helper = {

    dateConfigs: {

          drops:'down',
          startDate: moment().subtract(6, 'days'),
          endDate: moment(),
          minDate: '01/01/2012',
          maxDate: '12/31/2015',
          dateLimit: { days: 120 },
          showDropdowns: true,
          showWeekNumbers: true,
          timePicker: false,
          timePickerIncrement: 1,
          timePicker12Hour: true,
          ranges: {
             'Today': [moment(), moment()],
             'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
             'Last 7 Days': [moment().subtract(6, 'days'), moment()],
             'Last 30 Days': [moment().subtract(29, 'days'), moment()],
             'This Month': [moment().startOf('month'), moment().endOf('month')],
             'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
          },
          opens: 'left',
          format: 'MM/DD/YYYY',
          separator: ' to ',
          locale: {
              applyLabel: 'Apply',
              cancelLabel: 'Cancel',
              fromLabel: 'From',
              toLabel: 'To',
              customRangeLabel: 'Custom',
              daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
              monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
              firstDay: 1
              
            }
    },

    numberWithCommas : function(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    getTop5TrendsBarChartData: function(response,title,yAxisLabel,symbol){

    if (response !== undefined && response !== null){

      var trends = [];
      var counts = [];

      $.each(response.aggregations["2"].buckets,function(k,value){
        trends.push(symbol+value.key);
        counts.push(value.doc_count);

      });

        var dataChart =  {
              chart:     {type: 'column'}, 
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              xAxis:     {categories: trends }, 
              yAxis:     {title: {text: yAxisLabel } }, 
              plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                      rotation: -90,
                      color: '#FFFFFF',
                      align: 'right',
                      y: -10, // 10 pixels down from the top
                      style: {
                          fontSize: '9px',
                          fontFamily: 'Verdana, sans-serif'
                      }
                    }
                }
            },
              series: [{
                  name: 'Tweets',
                  data: counts
              }]
        };

      }else{
        return undefined;
      }
      return dataChart;

    },

    getHistTrendsBarChartData: function(response,title,yAxisLabel){

    if (response !== undefined && response !== null){

      var trends = [];
      var counts = [];

      $.each(response.aggregations["2"].buckets,function(k,value){

      // create a new javascript Date object based on the timestamp
      var date = new Date(value.key);
      // will display time in 10:30:23 format
      var formattedTime = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();

        trends.push(formattedTime);
        counts.push(value.doc_count);
      });

        var dataChart =  {
              chart:     {type: 'line'}, 
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              xAxis:     {categories: trends }, 
              yAxis:     {title: {text: yAxisLabel } }, 
              plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                      rotation: -90,
                      color: '#FFFFFF',
                      align: 'right',
                      y: -10, // 10 pixels down from the top
                      style: {
                          fontSize: '9px',
                          fontFamily: 'Verdana, sans-serif'
                      }
                    }
                }
            },
              series: [{
                  name: 'Tweets',
                  data: counts,
                  color: '#00aff0'
              }]
        };

      }else{
        return undefined;
      }
      return dataChart;

    },

    getMostFollowerBarChartData: function(response,title,yAxisLabel,symbol){

    if (response !== undefined && response !== null){

      var trends = [];
      var counts = [];

      $.each(response.aggregations["2"].buckets,function(k,value){
        trends.push(symbol+value.key);
        counts.push(value["1"].value);

      });

        var dataChart =  {
              chart:     {type: 'bar'}, 
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              xAxis:     {categories: trends }, 
              yAxis:     {title: {text: yAxisLabel } }, 
              plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                      rotation: -90,
                      color: '#FFFFFF',
                      align: 'right',
                      y: -10, // 10 pixels down from the top
                      style: {
                          fontSize: '9px',
                          fontFamily: 'Verdana, sans-serif'
                      }
                    }
                }
              },
              series: [{
                  name: 'Tweets',
                  data: counts,
                  color: '#A2DA4F'
              }]
        };

      }else{
        return undefined;
      }
      return dataChart;

    },

    getLanguageSentimentBarChartData: function(response,title,yAxisLabel){

    if (response !== undefined && response !== null){

      var uk = [];
      var ukpos = [];
      var ukneg = [];
      var ukneu = [];
      var count = 0;

      var languages = [];
      var countsPositive = [];
      var countsNeutral = [];
      var countsNegative = [];

      $.each(response.aggregations["2"].buckets,function(k,value){


        if (value.key == 'en-GB' || value.key == 'en-gb' || value.key == 'en'){

          var lan = getLanguageName(value.key);
          uk.push(lan);
          count++;

          $.each(value["3"].buckets,function(k,valueInner){
            if (valueInner.key == "positive") {
              ukpos.push(valueInner.doc_count);
            }
            else if (valueInner.key == "neutral") {
              ukneu.push(valueInner.doc_count);
            }
            else {
              ukneg.push(valueInner.doc_count);
            }
           }
         );

        }else{

          var lan = getLanguageName(value.key);
          languages.push(lan);
          count++;

          $.each(value["3"].buckets,function(k,valueInner){
            if (valueInner.key == "positive") {
              countsPositive.push(valueInner.doc_count);
            }
            else if (valueInner.key == "neutral") {
              countsNeutral.push(valueInner.doc_count);
            }
            else {
              countsNegative.push(valueInner.doc_count);
            }
           }
         );

        }
      });

      if (isNaN(parseInt(ukpos[0]))){ukpos[0] = 0; } 
      if (isNaN(parseInt(ukpos[1]))){ukpos[1] = 0; } 
      if (isNaN(parseInt(ukpos[2]))){ukpos[2] = 0; }

      if (isNaN(parseInt(ukneu[0]))){ukneu[0] = 0; } 
      if (isNaN(parseInt(ukneu[1]))){ukneu[1] = 0; } 
      if (isNaN(parseInt(ukneu[2]))){ukneu[2] = 0; }

      if (isNaN(parseInt(ukneg[0]))){ukneg[0] = 0; } 
      if (isNaN(parseInt(ukneg[1]))){ukneg[1] = 0; } 
      if (isNaN(parseInt(ukneg[2]))){ukneg[2] = 0; }

        if (count > 0){
          languages.push(uk[0]);
          countsPositive.push(ukpos[0]+ukpos[1]+ukpos[2]);
          countsNeutral.push(ukneu[0]+ukneu[1]+ukneu[2]);
          countsNegative.push(ukneg[0]+ukneg[1]+ukneg[2]);
        }
        
        var dataChart =  {
              chart:     {type: 'bar'}, 
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              xAxis:     {categories: languages }, 
              yAxis:     {title: {text: yAxisLabel } }, 
              plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                      rotation: -90,
                      color: '#FFFFFF',
                      align: 'right',
                      y: -10, // 10 pixels down from the top
                      style: {
                          fontSize: '9px',
                          fontFamily: 'Verdana, sans-serif'
                      }
                    }
                }
              },
              tooltip: {
                  pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                  shared: true
              },
              series: [{
                  name: 'Positive',
                  data: countsPositive
              }, {
                  name: 'Neutral',
                  data: countsNeutral
              }, {
                  name: 'Negative',
                  data: countsNegative
              }]
        };

      }else{
        return undefined;
      }
      return dataChart;

    },

    getGenderSentimentBarChartData: function(response,title,yAxisLabel){

    if (response !== undefined && response !== null){

      var gender = [];
      var countsPositive = [];
      var countsNeutral = [];
      var countsNegative = [];

      $.each(response.aggregations["2"].buckets,function(k,value){

        if (value.key == 'male'){
          gender.push("Male");
        }else{
          gender.push("Female");
        }

        $.each(value["3"].buckets,function(k,valueInner){
          if (valueInner.key == "positive") {
            countsPositive.push(valueInner.doc_count);
          }
          else if (valueInner.key == "neutral") {
            countsNeutral.push(valueInner.doc_count);
          }
          else {
            countsNegative.push(valueInner.doc_count);
          }
        });
      });

        var dataChart =  {
              chart:     {type: 'column'}, 
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              xAxis:     {categories: gender }, 
              yAxis:     {title: {text: yAxisLabel } }, 
              plotOptions: {
                column: {
                    stacking: 'percent'
                }
              },
              tooltip: {
                  pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                  shared: true
              },
              series: [{
                  name: 'Positive',
                  data: countsPositive
              }, {
                  name: 'Neutral',
                  data: countsNeutral
              }, {
                  name: 'Negative',
                  data: countsNegative
              }]
        };

      }else{
        return undefined;
      }
      return dataChart;

    },

    getSentimentPieChartData: function(response,title,yAxisLabel){

    if (response !== undefined && response !== null){

      var sentiments = [];
      var counts = [];

      $.each(response.aggregations["2"].buckets,function(k,value){

        var sentiment;

        if (value.key == 'positive'){
          sentiment = 'Positive';
        }else if (value.key =='negative'){
          sentiment = 'Negative';
        }else{
          sentiment = 'Neutral';
        }

        sentiments.push(sentiment);
        counts.push(value.doc_count);
      });

      var dataArray = [];

      for (index = 0; index < sentiments.length; index++) {
        dataArray.push([sentiments[index], counts[index]]);
      }

      var dataChart =  {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false
              },
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                      },
                      showInLegend: true
                  }
              },
              series: [{
                  type: 'pie',
                  name: 'Tweets',
                  data: dataArray
              }]
        };
      }else{
        return undefined;
      }
      return dataChart;
    },

    getTweetTimePieChartData: function(response,title,yAxisLabel){

    if (response !== undefined && response !== null){

      var languages = [];
      var counts = [];

      $.each(response.aggregations["2"].buckets,function(k,value){
        languages.push(value.key);
        counts.push(value.doc_count);
      });

      var dataArray = [];
      var otherCount = 0;

      for (index = 0; index < languages.length; index++) {
        if (index < 10) {
          dataArray.push([languages[index], counts[index]]);
        }
        else if (index == (languages.length-1)) {
          otherCount += counts[index];
          dataArray.push(["other", otherCount]);
        }
        else {
          otherCount += counts[index];  
        }
      }

      var dataChart =  {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false
              },
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                      },
                      showInLegend: true
                  }
              },
              series: [{
                  type: 'pie',
                  name: 'Languages',
                  data: dataArray
              }]
        };

      }else{
        return undefined;
      }
      return dataChart;

    },

    getLanguagePieChartData: function(response,title,yAxisLabel){

    if (response !== undefined && response !== null){

      var uk = [];
      var ukcounts = [];
      var count = 0;

      var languages = [];
      var counts = [];

      console.log(response);

      $.each(response.aggregations["2"].buckets,function(k,value){


        if (value.key == 'en-GB' || value.key == 'en-gb' || value.key == 'en'){
          var lan = getLanguageName(value.key);
          uk.push(lan);
          count++;
          ukcounts.push(value.doc_count);
        }else{
          var lan = getLanguageName(value.key);
          languages.push(lan);
          count++;
          counts.push(value.doc_count);
        }
      });

      var dataArray = [];
      var otherCount = 0;

      for (index = 0; index < languages.length; index++) {
        if (index < 10) {
          dataArray.push([languages[index], counts[index]]);
        }
        else if (index == (languages.length-1)) {
          otherCount += counts[index];
          dataArray.push(["Other", otherCount]);
          count++;
        }
        else {
          otherCount += counts[index];  
        }
      }

      if (isNaN(parseInt(ukcounts[0]))){ukcounts[0] = 0; } 
      if (isNaN(parseInt(ukcounts[1]))){ukcounts[1] = 0; } 
      if (isNaN(parseInt(ukcounts[2]))){ukcounts[2] = 0; }

      if (count > 0){
        dataArray.push([uk[0], ukcounts[0]+ukcounts[1]+ukcounts[2]]);
      }    

      console.log(dataArray);

      var dataChart =  {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false
              },
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                      },
                      showInLegend: true
                  }
              },
              series: [{
                  type: 'pie',
                  name: 'Tweets',
                  data: dataArray
              }]
        };

      }else{
        return undefined;
      }
      return dataChart;

    },

    getTravellerBarChartData: function(response,title,yAxisLabel){

    if (response !== undefined && response !== null){

      var index = 0;
      var screenName = [];
      var dataArray = [];
      var record = [];

      $.each(response.aggregations["2"].buckets,function(k,value){
          $.each(value["3"].buckets,function(k,valueInner){

            var dataTmp={name: valueInner.key, data: [[index, valueInner.doc_count]]};
            dataArray.push(dataTmp);
          });

          if (dataArray === undefined || dataArray === null || dataArray.length == 0){
            // do nothing
          } else {
            for (var i = 0; i < 5; i++) {
              record.push(dataArray[i]);
            }
            screenName.push(value.key);
            index++;
          }
      });

        var dataChart =  {
              chart:     {type: 'column'}, 
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              xAxis:     {categories: screenName }, 
              yAxis: {
                  min: 0, title: {text: yAxisLabel }, 
                  stackLabels: {
                      enabled: true,
                      style: {
                          fontWeight: 'bold',
                          color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                      }
                  }
             },
             legend: {
                    align: 'right',
                    borderWidth: 0,
                    layout: 'vertical',
                    itemMarginTop: 7,
                    itemMarginBottom: 7,
                    itemStyle: {
                      lineHeight: '25px',
                      fontFamily: "'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
                      fontSize: '14px',
                      color: '#333'
                    },

                    verticalAlign: 'top',
                    x: -60,
                    y: 110
                  },
              plotOptions: {
                  stacking: 'percent',
                  dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                      textShadow: '0 0 3px black'
                    }
                  }
            },
            series: dataArray
        };

      }else{
        return undefined;
      }
      return dataChart;
    },

    getElectionPopAnalysisBarChartData: function(response,title,yAxisLabel){

    if (response !== undefined && response !== null){

      var dataArray = [];
      var key = [];
      var count = [];

      $.each(response.aggregations["2"].buckets,function(k,value){
        key.push(value.key);
        count.push(value.doc_count);
      });

      $.each(response.aggregations["3"].buckets,function(k,value){
        key.push(value.key);
        count.push(value.doc_count);
      });

      $.each(response.aggregations["4"].buckets,function(k,value){
        key.push(value.key);
        count.push(value.doc_count);
      });

      for (index = 0; index < key.length; index++) {
          dataArray.push([key[index], count[index]]);
      }

      var dataChart =  {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false
              },
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                      },
                      showInLegend: true
                  }
              },
              series: [{
                  type: 'pie',
                  name: 'Popularity',
                  data: dataArray
              }]
        };

      }else{
        return undefined;
      }
      return dataChart;

    },

    getElectionPartyAnalysisBarChartData: function(response,title,yAxisLabel){

    if (response !== undefined && response !== null){

      var dataArray = [];
      var key = [];
      var count = [];

      $.each(response.aggregations["2"].buckets,function(k,value){
          $.each(value["3"].buckets,function(k,valueInner){
            key.push(valueInner.key);
            count.push(valueInner.doc_count);
        });
      });

      for (index = 0; index < key.length; index++) {
          dataArray.push([key[index], count[index]]);
      }

      var dataChart =  {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false
              },
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                      },
                      showInLegend: true
                  }
              },
              series: [{
                  type: 'pie',
                  name: 'Sentiment',
                  data: dataArray
              }]
        };

      }else{
        return undefined;
      }
      return dataChart;
    },

    getMovieBarChartData: function(response,title,yAxisLabel){

    if (response !== undefined && response !== null){

      var dataArray = [];
      var key = [];
      var count = [];

      for (index = 0; index < 10; index++) {
          key.push(response.context[index]["Film"]);
          count.push(response.context[index]["Weekend Gross"]);
          dataArray.push([key[index], count[index]]);
      }

      var dataChart =  {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false
              },
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                      },
                      showInLegend: true
                  }
              },
              series: [{
                  type: 'pie',
                  name: 'Weekend Gross',
                  data: dataArray
              }]
        };

      }else{
        return undefined;
      }
      return dataChart;
    },

    getTweetDayPieChartData: function(response,title,yAxisLabel){

    if (response !== undefined && response !== null){

      var dataArrayInner = [];
      var dataArrayOutter = [];
      var keyInner = [];
      var countInner = [];
      var keyOutter = [];
      var countOutter = [];

      $.each(response.aggregations["2"].buckets,function(k,value){

          keyInner.push(value.key);

          // Need to average out to get a better result
          if (value.key == "weekday") {
           countInner.push(value.doc_count/5);
          }
          else {
            countInner.push(value.doc_count/2);
          }

          $.each(value["3"].buckets,function(k,valueInner){

            keyOutter.push(valueInner.key);

            // Need to average out to get a better result
            if (value.key == "weekday") {
              countOutter.push(valueInner.doc_count/5);
             }
             else {
               countOutter.push(valueInner.doc_count/2);
             }
          });
      });

      for (index = 0; index < keyInner.length; index++) {
          dataArrayInner.push([keyInner[index], countInner[index]]);
      }

      for (index = 0; index < keyOutter.length; index++) {
          dataArrayOutter.push([keyOutter[index], countOutter[index]]);
      }

      var dataChart =  {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false
              },
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                      },
                      showInLegend: true
                  }
              },
              series: [{
                  type: 'pie',
                  name: 'Day Type',
                  size: '60%',
                  data: dataArrayInner
              }, {
                  type: 'pie',
                  name: 'Sentiment',
                  size: '80%',
                  innerSize: '60%',
                  data: dataArrayOutter
              }]
        };

      }else{
        return undefined;
      }
      return dataChart;
    },

    getClusterData: function(response,title){

      if (response !== undefined && response !== null){


          if (response.hits.total > 0) {
             $('#cluster').text("");
          } else {
             $('#cluster').text("no results found");
          }


          response.clusters.forEach(function(cluster) {
             calculateUniqueDocumentsCount(cluster);
          });

          var visualizationInput = {
             groups: response.clusters.map(function mapper(cluster) {
                console.log(cluster.phrases[0]+","+cluster.uniqueDocumentsCount);
                return {
                   label: cluster.phrases[0],
                   weight: cluster.uniqueDocumentsCount,
                   groups: (cluster.clusters || []).map(mapper)
                 }
              })
            };
          if (typeof foamtree !== 'undefined'){
                foamtree.dispose();
          }
          foamtree = new CarrotSearchFoamTree({
             id: "cluster",
             dataObject: visualizationInput,
              groupSelectionOutlineColor: "#fff",
              groupSelectionOutlineShadowSize: 2,
              groupSelectionOutlineShadowColor: "#000",
              groupFillGradientRadius: 1.2,
              groupFillGradientCenterLightnessShift: 30,
              groupFillGradientRimSaturationShift: 20,
              groupFillGradientRimLightnessShift: -15,
              groupStrokeType: "gradient",
              groupStrokeGradientLowerLightnessShift: 0,
              groupHoverStrokeLightnessShift: 10,
              groupExposureShadowColor: "#000",
              groupUnexposureLightnessShift: -50,
              groupUnexposureLabelColorThreshold: 0.15,
              rainbowColorDistribution: "linear",
              rainbowColorDistributionAngle: 45,
              rolloutEasing: "bounce",
              rolloutDuration: 4000,
              rolloutScalingStrength: -0.65,
              rolloutRotationStrength: 0.7,
              rolloutTransformationCenter: 1,
              pullbackEasing: "bounce",
              pullbackDuration: 4000,
              pullbackScalingStrength: -0.65,
              pullbackRotationStrength: 0.7,
              pullbackTransformationCenter: 1,
              pullbackPolygonDelay: 1,
              attributionPosition: 45
          });
         
          console.log(visualizationInput);
      }else{
        return undefined;
      }

    },

   getWeatherSentimentBarChartData: function(response, title,yAxisLabel){

    if (response !== undefined && response !== null){

      var sentiment_date = [];
      var countsPositive = [];
      var countsNeutral = [];
      var countsNegative = [];
      var barchart = {};

      $.each(response.aggregations["2"].buckets,function(k,value){

        var date = new Date(value.key);
        var formattedDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    
        $.each(value["4"].buckets,function(l,timeValue){

        var pos, neg, neut;
        if(formattedDate in barchart){

          pos = barchart[formattedDate].cp;
          neg = barchart[formattedDate].np;
          neut = barchart[formattedDate].neutp;
        } else{
          
          pos = 0;
          neg = 0;
          neut = 0;
          barchart[formattedDate] = {cp : pos, np: neg, neutp: neut};
        }

        $.each(timeValue["3"].buckets,function(m,sentValue){
          if (sentValue.key == "positive") {
            pos += sentValue.doc_count;
          }
          else if (sentValue.key == "neutral") {
            neut += sentValue.doc_count;
          }
          else {
            neg += sentValue.doc_count;
          }
        });

        barchart[formattedDate].cp = pos;
        barchart[formattedDate].np = neg;
        barchart[formattedDate].neutp = neut;
    });
  });

  var keys = [];
  var sorted_barchart = {};

  for(var k in barchart){
    if(barchart.hasOwnProperty(k)){
      keys.push(k);
    }
  }

  keys.sort();

  jQuery.each(keys, function(i, k){
    sorted_barchart[k] = barchart[k];
  });

  for(var k in sorted_barchart){
    sentiment_date.push(k);
    countsPositive.push(sorted_barchart[k].cp);
    countsNegative.push(sorted_barchart[k].np);
    countsNeutral.push(sorted_barchart[k].neutp);
  }

  var key = [];
  var tempMin = [];//the minimum temperature daily
  var tempMax = [];//the maximum temperature daily
  var tempAverage = [];//the average temperature daily
  var windMax = [];//the maximum wind speed daily
  var humidityMax = [];//the maximum humidity daily
  var linechartMin = {};
  var linechartMax = {};
  var linechartAverage = {};
  var linechartWindMax = {};
  var linechartHumidityMax = {};
  var date_record = [];

//gets the data from couchdb weather database
  $.ajax({
        url: 'http://127.0.0.1:5984/weather/_all_docs?include_docs=true' ,
        type: 'GET',
        contentType: 'application/json',
        crossDomain: true,
        dataType: 'json',
        global: false,
        async:false,
        success: function(tempResponse) {//tempResponse is the response from weather database

        for (index = 0; index < tempResponse.total_rows; index++) {

          var weather = tempResponse.rows[index]["doc"]["data"]["weather"]["0"];
          var w_date = new Date(weather["date"]);
          var date = w_date.getFullYear() + '-' + (w_date.getMonth()+1) + '-' + w_date.getDate();

          if(!(date_record.indexOf( date) > -1) ){

              var x = weather["hourly"];
              var tempValue = [];
              var windValue = [];
              var humidityValue = [];

              for(i = 0; i < 8; i++){
                var hour = x[i]['time'].split('00')[0];
                var time = date + " " + hour + ":00";
                tempValue.push(parseInt(x[i]['FeelsLikeC']));//we are getting hourly 'feelsLike' Temperatures
                windValue.push(parseInt(x[i]['windspeedKmph']));//we are getting hourly 'windspeedKmph' wind speed
                humidityValue.push(parseInt(x[i]['humidity']));//we are getting hourly 'humidity' values
              }

              var minVal = Math.min.apply(Math, tempValue);//get the min temp
              var maxVal = Math.max.apply(Math, tempValue);//get the max temp
              var averageVal = (minVal + maxVal)/2; // get the average of min and max
              var maxWind = Math.max.apply(Math, windValue);//get the max wind
              var maxHumidity = Math.max.apply(Math, humidityValue);//get the max humidity

              if(sentiment_date.indexOf(date)>-1){//only one weather prediction per day, others ignored
                linechartMin[date] = {tempV : parseFloat(minVal)};
                linechartMax[date] = {tempV : parseFloat(maxVal)};
                linechartAverage[date] = {tempV : parseFloat(averageVal)};
		linechartWindMax[date] = {speedV : parseFloat(maxWind)};
		linechartHumidityMax[date] = {humidV : parseFloat(maxHumidity)};
              }
              date_record.push(date)
            }
        }

//we are assigning 'null' value if no weather data for the date
        for( var k in barchart){
          if(barchart.hasOwnProperty(k) && !linechartMin.hasOwnProperty(k)){
            linechartMin[k] = {tempV : null};
          }
          if(barchart.hasOwnProperty(k) && !linechartMax.hasOwnProperty(k)){
            linechartMax[k] = {tempV : null};
          }
          if(barchart.hasOwnProperty(k) && !linechartAverage.hasOwnProperty(k)){
            linechartAverage[k] = {tempV : null};
          }
          if(barchart.hasOwnProperty(k) && !linechartWindMax.hasOwnProperty(k)){
            linechartWindMax[k] = {speedV : null};
          }
          if(barchart.hasOwnProperty(k) && !linechartHumidityMax.hasOwnProperty(k)){
            linechartHumidityMax[k] = {humidV : null};
          }
        }

	//sorting minimum temperature values
	//sorting maximum temperature values
	//sorting average temperature values
	//sorting maximum wind values
	//sorting humidity values
        tempMin = keySorter(linechartMin, 'tempV');
        tempMax = keySorter(linechartMax, 'tempV');
        tempAverage = keySorter(linechartAverage, 'tempV');
        windMax = keySorter(linechartWindMax, 'speedV');
        humidityMax = keySorter(linechartHumidityMax, 'humidV');

      },
      error: function(jqXHR, textStatus, errorThrown) {
         var jso = jQuery.parseJSON(jqXHR.responseText);
         console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
        }
      });
//highchart options
      var dataChart =  {
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              xAxis:     {categories: sentiment_date }, 
              yAxis:     [{ 
              title: {
                text: 'Sentiment',
                style: {
                  color: Highcharts.getOptions().colors[0]
                }
              },
              labels: {
                format: '{value}',
                style: {
                  color: Highcharts.getOptions().colors[0]
                }
              }
            },{
              labels: {
                format: '{value}°C',
                style: {
                  color: Highcharts.getOptions().colors[1]
                }
              },
              title: {
                text: 'Temperature, Wind Speed, Humidity',
                style: {
                  color: Highcharts.getOptions().colors[1]
                }
              },
              opposite: true,  
            }
         ],
         plotOptions: {
           column: {
           stacking: 'percent'
           }
         },
         series: [{
                  type: 'column',
                  name: 'Positive',
                  data: countsPositive
              }, {
                  type: 'column',
                  name: 'Neutral',
                  data: countsNeutral
              }, {
                  type: 'column',
                  name: 'Negative',
                  data: countsNegative
              }, {
                  type: 'line',
                  name: 'Min Temp',
                  yAxis: 1,
                  data: tempMin
              }, {
                  type: 'line',
                  name: 'Max Temp',
                  yAxis: 1,
                  data: tempMax
              }, {
                  type: 'line',
                  name: 'Average Temp',
                  yAxis: 1,
                  data: tempAverage
              }, {
                  type: 'line',
                  name: 'Max Wind Speed',
                  yAxis: 1,
                  data: windMax
              }, {
                  type: 'line',
                  name: 'Humidity',
                  yAxis: 1,
                  data: humidityMax
              }]
         };
      }else{
        return undefined;
      }
      return dataChart;
    },

    getWeatherTypeSentimentBarChartData: function(pos, neu, neg, title,yAxisLabel){

      var dataArray = [];

      dataArray.push(["positive", pos]);
      dataArray.push(["neutral", neu]);
      dataArray.push(["negative", neg]);

      var dataChart =  {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false
              },
              credits:   {enabled: false }, 
              exporting: {enabled: true }, 
              title:     {text: title }, 
              plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                      },
                      showInLegend: true
                  }
              },
              series: [{
                  type: 'pie',
                  name: 'Sentiment',
                  data: dataArray
              }]
        };
      return dataChart;
    }

}
