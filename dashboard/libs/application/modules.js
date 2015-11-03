/* Exploring sentiment in Edinburgh using social media on cloud resources
 Authors: Andres Chaves, Diego Montufar, Ilkan Esiyok, Gustavo Carrion, Clifford Siu
 ID’s: 706801, 661608, 616394,667597, 591158
 Modules.js: This is a class that contains all the methods to interact with the Elastic search API. It build the relevant query, invoque the API using AJAX and display the widget
*/


var Modules = {
    
    search_url: 'http://115.146.93.240:9200/melbourne-index/tweet/_search',
    search_clusters_url: 'http://115.146.93.240:9200/melbourne-index/tweet/_search_with_clusters',
    hashtag_field: "entities.hashtags.text",
    sentiment_field: "sentiment_analysis.sentiment",
    username_field: "user.screen_name",
    
    populateNTweetsLabel: function(query){

    	var request = QBuilder.getEmptyAggregation(query);

    	$.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var hits = "Hits: ";
                var res = Helper.numberWithCommas(response.hits.total);

                $('#NTweetsFound').text(hits + res);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },
    
    populateNTweetsLabelGeoLimits: function(query,points){

    	var request = QBuilder.getPolygonAggregation(query,points);
    	console.log("Query:----"+request);
    	$.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var hits = "Hits: ";
                var res = Helper.numberWithCommas(response.hits.total);

                $('#NTweetsFound').text(hits + res);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },
    
    populateTop5TrendsGeoLimits: function(query,geoPoints,idTrendsBarChart){

    	var request = QBuilder.getBasicPolygonAggregation(query,5,this.hashtag_field,geoPoints);

    	$.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {
                
                var title = "Top 5 Trends by Topic";

                var dataChart = Helper.getTop5TrendsBarChartData(response,title,'Tweets', "#");

                $(idTrendsBarChart).highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },
    
    populateTop5Trends: function(query){

    	var request = QBuilder.getBasicAggregation(query,5,this.hashtag_field);

    	$.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {
                
                var title = "Top 5 Trends by Topic";

                var dataChart = Helper.getTop5TrendsBarChartData(response,title,'Tweets', "#");

                $('#top5-trends-barchart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateTop5UsersGeoLimits: function(query,geoPoints,idUsersBarChart){

    	var request = QBuilder.getBasicPolygonAggregation(query,5,this.username_field,geoPoints);

    	$.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {
                
                var title = "Top 5 Users by Topic";

                var dataChart = Helper.getTop5TrendsBarChartData(response,title,'Tweets',"@");

                $(idUsersBarChart).highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },
    
    populateTop5Users: function(query){

    	var request = QBuilder.getBasicAggregation(query,5,this.username_field);

    	$.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {
                
                var title = "Top 5 Users by Topic";

                var dataChart = Helper.getTop5TrendsBarChartData(response,title,'Tweets',"@");

                $('#top5-users-barchart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateHistogramTrends: function(query){

        var request = QBuilder.getHistogramAggregation(query);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var title = "Total of Tweets by Week";

                var dataChart = Helper.getHistTrendsBarChartData(response,title,'Tweets');

                $('#histogram-trends-barchart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateMostProlificTweeter: function(query){

        var request = QBuilder.getProlificTweeterAggregation(query,5);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var title = "Top 5 prolific Tweeterers";

                var dataChart = Helper.getTop5TrendsBarChartData(response,title,'Tweets',"@");

                $('#prolific-barchart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateMostFollowers: function(query){

        var request = QBuilder.getFollowerAggregation(query,5);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var title = "Top 5 Users with most followers";

                var dataChart = Helper.getMostFollowerBarChartData(response,title,'Tweets',"@");

                $('#follower-barchart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateLanguageSentiment: function(query){

        var request = QBuilder.getLanguageSentimentAggregation(query,10);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var title = "Sentiment Analysis by Culture";

                var dataChart = Helper.getLanguageSentimentBarChartData(response,title,'Tweets',"");

                $('#language-barchart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateGenderSentiment: function(query){

        var request = QBuilder.getGenderSentimentAggregation(query,0);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var title = "Gender and Sentiment Analysis";

                var dataChart = Helper.getGenderSentimentBarChartData(response,title,'Percentage',"");

                $('#gender-barchart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });

    },
    
    populatePieChartSentimentGeoLimits: function(query,geoPoints,idSentimentPieChart){

    	var request = QBuilder.getBasicPolygonAggregation(query,5,this.sentiment_field,geoPoints);

    	$.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {
                
                var title = "Overall Sentiment analysis";

                var dataChart = Helper.getSentimentPieChartData(response,title,'Percentage',"");

                $(idSentimentPieChart).highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populatePieChartSentiment: function(query){

    	var request = QBuilder.getBasicAggregation(query,5,this.sentiment_field);

    	$.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {
                
                var title = "Overall Sentiment analysis";

                var dataChart = Helper.getSentimentPieChartData(response,title,'Percentage',"");

                $('#sentiment-piechart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateLanguageOverall: function(query){

        var request = QBuilder.getLanguageSentimentAggregation(query,0);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var title = "% of Tweets by Culture";

                var dataChart = Helper.getLanguagePieChartData(response,title,'Percentage',"");

                $('#language-piechart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });

    },

    populateFavouritePlace: function(query, searchTerm, placeName, divId){

        var request = QBuilder.getFavouritePlaceAggregation(query, searchTerm);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

              var title = placeName;
              var dataChart = Helper.getSentimentPieChartData(response,title,'Percentage',"");

              $(divId).highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },


    populateActiveTraveller: function(query){

        var request = QBuilder.getActiveTravellerAggregation(query,10);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var title = "Most Active Traveller Analysis";

                var dataChart = Helper.getTravellerBarChartData(response,title,'Tweets',"");

                $('#traveller-barchart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateElectionPopAnalysis: function(query){

        var request = QBuilder.getElectionPopAnalysisAggregation(query);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var title = "Edinburgh Parties Popularity";

                var dataChart = Helper.getElectionPopAnalysisBarChartData(response,title,'Tweets',"");

                $('#election-piechart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateElectionPartyAnalysis: function(query, partyName, chartName){

        var request = QBuilder.getElectionPartyAnalysisAggregation(query, partyName);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                if (partyName == "snp") {
                  partyName = "SNP";
                }
                else if (partyName == "conservative") {
                  partyName = "Conservative";
                }
                else if (partyName == "uklabour") {
                  partyName = "Labour";
                }
                else if (partyName == "David_Cameron") {
                  partyName = "David Cameron";
                }
                else if (partyName == "NicolaSturgeon") {
                  partyName = "Nicola Sturgeon";
                }


                var title = "Sentiment Analysis for " + partyName;

                var dataChart = Helper.getElectionPartyAnalysisBarChartData(response,title,'Tweets',"");

                $(chartName).highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateMovie: function(query, id, chartName, chartTitle){

        $.ajax({
            url: 'http://127.0.0.1:5984/ukboxoffice/' + id,
            type: 'GET',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            success: function(response) {

                var title = "Movie Rank: " + chartTitle;

                var dataChart = Helper.getMovieBarChartData(response,title,'Tweets',"");

                $(chartName).highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateTweetTime: function(query){

        var request = QBuilder.getTweetTimeAggregation(query);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var title = "Frequency of Tweet by Time";

                var dataChart = Helper.getTweetTimePieChartData(response,title,'Tweets',"");

                $('#tweettime-piechart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },

    populateTweetDaySentiment: function(query){

        var request = QBuilder.getTweetDaySentimentAggregation(query);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var title = "Sentiment: Weekday vs Weekend (Avg)";

                var dataChart = Helper.getTweetDayPieChartData(response,title,'Tweets',"");

                $('#tweetweek-piechart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });
    },


    populateSentimentMap: function(query){
      //Get the data
	var request = {
	  "size": 500000,
          "fields" : ["coordinates.coordinates","sentiment_analysis.sentiment"],
	  "query": {
	    "query_string": {
	      "analyze_wildcard": true,
	      "query": query+" AND (sentiment_analysis.sentiment:positive OR sentiment_analysis.sentiment:negative OR sentiment_analysis.sentiment:neutral)"

	    }
	  }	  
	};

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            // async: false,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                console.log(response);

                var title = "Language and Sentiment Analysis";

		var hits = response.hits.hits
		var positiveData = new Array();
		var negativeData = new Array();
		for (var index in hits){
                        hit = hits[index];
			coords=hit.fields["coordinates.coordinates"];
                        sentiment=hit.fields["sentiment_analysis.sentiment"];
			latlng = new google.maps.LatLng(coords[1], coords[0]);
			
			if (sentiment=='negative'){
				negativeData.push(latlng);
			}
			if (sentiment=='positive'){
				positiveData.push(latlng);
                        }
		}
		//Heat map
		var posPointArray = new google.maps.MVCArray(positiveData);
		var negPointArray = new google.maps.MVCArray(negativeData);
                if (typeof positiveHeatmap !== 'undefined'){
                    positiveHeatmap.setMap(null)
                }
                if (typeof negativeHeatmap !== 'undefined'){
                    negativeHeatmap.setMap(null)
                }
		positiveHeatmap = new google.maps.visualization.HeatmapLayer({
		data: posPointArray,
                dissipating: true,
		radius: 40,
		maxIntensity: 20,
		map:map,
                gradient:gradient1
		});
		negativeHeatmap = new google.maps.visualization.HeatmapLayer({
		data: negPointArray,
                dissipating: true,
		radius: 40,
		maxIntensity: 20,
		map:map,
                gradient:gradient2
		});
                console.log('Map Updated');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
	});

    },

    populateCluster: function(query){
        var key = $("#query").val();
        var query = key;
        isAText = key.search(/text:/i);

       	if(isAText != -1){ //If does have text field, erase it
       		key = key.replace("text:","");
       	}else{
             query = "text:" + query;
        }

        var request = QBuilder.getClusteredData(query,key);

        var getUrl = this.search_clusters_url+"?"
           + "q="+encodeURIComponent(query)+"&"
           + "size=20000&"
           + "field_mapping_title=_source.title&"
           + "field_mapping_content=_source.text&algorithm=lingo&include_hits=false";
 
        $.ajax({
            url: getUrl,
            type: 'GET',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            //data: JSON.stringify(request),
            success: function(response) {

                var title = "Clustering";
                var foamTree=Helper.getClusterData(response,title);
                console.log("DONE");

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        }); 
        console.log(JSON.stringify(request));
   },

    populateWeatherSentiment: function(query) {

    if(query.indexOf("*") > -1){
      query = "created_at:[" + startDate + " TO " + endDate + "]";
    }

    var request = QBuilder.getWeatherSentimentAggregation(query);

        $.ajax({
            url: this.search_url,
            type: 'POST',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(response) {

                var title = "Weather and Sentiment Analysis";

                var dataChart = Helper.getWeatherSentimentBarChartData(response, title,'Tweets',"");

                $('#weather-barchart').highcharts(dataChart);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var jso = jQuery.parseJSON(jqXHR.responseText);
                console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
            }
        });

    },

    populateWeatherTypeSentiment: function(query, searchTerm, weatherTitle, divId) {

    var array = [];
    var result = [];
    var positive = 0;
    var negative = 0;
    var neutral = 0;

    var returnObject = $.ajax({
        url: 'http://127.0.0.1:5984/weather/_all_docs?include_docs=true',
        type: 'GET',
        contentType: 'application/json',
        crossDomain: true,
        dataType: 'json',
        global: false,
        async: false,
        success: function(weatherResponse) {},
        error: function(jqXHR, textStatus, errorThrown) {
            var jso = jQuery.parseJSON(jqXHR.responseText);
            console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
        }
    });

    var weatherResponse = JSON.parse(returnObject["responseText"]);

    // Loop through all the JSON files
    for (index = 0; index < weatherResponse.total_rows; index++) {

      var weatherType = weatherResponse.rows[index]["doc"]["data"]["current_condition"]["0"]["weatherDesc"]["0"]["value"];
      var weatherDate = weatherResponse.rows[index]["doc"]["data"]["weather"]["0"]["date"];

      // Search for the exact weather type from the JSON file
      if (weatherType.toUpperCase() == searchTerm.toUpperCase()) {

        var w_date = new Date(weatherDate);
        var date = w_date.getFullYear() + '-' + (w_date.getMonth()+1) + '-' + w_date.getDate();
        array.push(date);
      }
    }

    // only store the unique date
    var hash = {}, result = [];
    for (var i = 0, l = array.length; i < l; ++i) {
      if (!hash.hasOwnProperty(array[i])) {
        hash[array[i]] = true;
        result.push(array[i]);
      }
    }

    // query the date one by one and add up the result
    for (var i = 0; i < result.length; i++) {

      var request = QBuilder.getWeatherTypeSentimentAggregation(query, "date_only:" + result[i]);

      $.ajax({
        url: this.search_url,
        type: 'POST',
        contentType: 'application/json',
        crossDomain: true,
        dataType: 'json',
        data: JSON.stringify(request),
        success: function(response) {

          $.each(response.aggregations["2"].buckets,function(k,value){

            if (value.key == "positive") {
              positive += value.doc_count;
            }
            if (value.key == "negative") {
              negative += value.doc_count;
            }
            if (value.key == "neutral") {
              neutral += value.doc_count;
            }
          });

          var title = weatherTitle;
          var dataChart = Helper.getWeatherTypeSentimentBarChartData(positive, neutral, negative, title,'Count',"");

          $(divId).highcharts(dataChart);

        },
        error: function(jqXHR, textStatus, errorThrown) {
          var jso = jQuery.parseJSON(jqXHR.responseText);
          console.log( jqXHR.status + ':' + errorThrown + ':' + jso.error);
        }
      });
    }
  }

}
