/* Exploring sentiment in Edinburgh using social media on cloud resources
 Authors: Andres Chaves, Diego Montufar, Ilkan Esiyok, Gustavo Carrion, Clifford Siu
 ID’s: 706801, 661608, 616394,667597, 591158
 Qbuilder.js: This is a class for building the specific JSON query syntax following Elasticsearch DSL
*/

var QBuilder = {
    
    getEmptyAggregation: function (query) {
        
      var request = {
              "size": 0,
              "query": {
                "query_string": {
                  "analyze_wildcard": true,
                  "query": query
                }
              },
              "aggs": {
              }
            };

        return request;
    },
    getPolygonAggregation: function (query,strPoints) {
        
    	var points = JSON.parse(strPoints);
        var request = {
                "size": 0,
                "query": {
                  "query_string": {
                    "analyze_wildcard": true,
                    "query": query}},
                    "filter":{"geo_polygon":{"coordinates":{
                    	points}}},
                "aggs": {
                }
              };

          return request;
      },
    
    getBasicAggregation: function (query,size,field) {
        
      var request = {
              "size": 0,
              "query": {
                "query_string": {
                  "analyze_wildcard": true,
                  "query": query
                }
              },
              "aggs": {
                "2": {
                  "terms": {
                    "field": field,
                    "size": size,
                    "order": {
                      "_count": "desc"
                    }
                  }
                }
              }
            };

        return request;
    },
    
    getBasicPolygonAggregation: function (query,size,field,strPoints) {
    	var points = JSON.parse(strPoints);
        
        var request ={"size":0,"query":{"filtered":{
        	"query": { "wildcard": { "text": query }},
        	"filter":
        	{"bool":{ "should":[
        	{"geo_polygon":{
        		"coordinates":{points}}}]}}}},"aggs":{"2": {
        	                    "terms": {
        	                    	"field": field,
        	                      "size": 5,
        	                      "order": {
        	                        "_count": "desc"
        	                      }
        	                    }
        	                  }
        	                 }
        	}

          return request;
      },

    getHistogramAggregation: function (query) {

        var request = {
                  "query": {
                    "query_string": {
                      "query": "*",
                      "analyze_wildcard": true
                    }
                  },
                  "size": 0,
                  "aggs": {
                    "2": {
                      "date_histogram": {
                        "field": "date.date_only",
                        "interval": "1w",
                        "pre_zone": "+10:00",
                        "pre_zone_adjust_large_interval": true,
                        "min_doc_count": 1
                      }
                    }
                  }
                };

        return request;
    },

    getProlificTweeterAggregation: function (query,size) {

        var request = {
      "query": {
        "filtered": {
          "query": {
            "query_string": {
              "analyze_wildcard": true,
              "query": "*"
            }
          },
          "filter": {
            "bool": {
              "must": [
                {
                  "query": {
                    "query_string": {
                      "analyze_wildcard": true,
                    "query": "*"
                  }
                }
              }
            ],
            "must_not": []
          }
        }
      }
    },
    "size": 0,
    "aggs": {
      "2": {
        "terms": {
          "field": "user.screen_name",
          "size": size,
          "order": {
            "_count": "desc"
          }
        }
      }
                }
       };

        return request;
    },

    getFollowerAggregation: function (query,size) {

        var request = {
      "query": {
        "filtered": {
          "query": {
            "query_string": {
              "analyze_wildcard": true,
              "query": "*"
            }
          },
          "filter": {
            "bool": {
              "must": [
                {
                  "query": {
                    "query_string": {
                      "analyze_wildcard": true,
                      "query": "*"
                    }
                  }
                }
            ],
            "must_not": []
          }
        }
      }
    },
    "size": 0,
    "aggs": {
      "2": {
        "terms": {
          "field": "user.screen_name",
          "size": size,
          "order": {
            "1": "desc"
          }
        },
        "aggs": {
          "1": {
            "max": {
              "field": "user.followers_count"
            }
          }
        }
      }
    }
       };

        return request;
    },

    getLanguageSentimentAggregation: function (query,size) {

        var request = {
              "query": {
                "filtered": {
                  "query": {
                    "query_string": {
                      "analyze_wildcard": true,
                      "query": query
                    }
                  }
                }
              },
              "size": 0,
              "aggs": {
                "2": {
                  "terms": {
                    "field": "user.lang",
                    "size": size,
                    "order": {
                      "_count": "desc"
                    }
                  },
                  "aggs": {
                    "3": {
                      "terms": {
                        "field": "sentiment_analysis.sentiment",
                        "size": 3,
                        "order": {
                          "_count": "desc"
                        }
                      }
                    }
                  }
                }
              }
            };

        return request;
    },

    getGenderSentimentAggregation: function (query,size) {

        var request = {
      "query": {
        "query_string": {
          "query": query,
          "analyze_wildcard": true
        }
      },
      "size": 0,
      "aggs": {
        "2": {
          "terms": {
            "field": "user.gender",
            "size": 0,
            "order": {
              "_count": "desc"
            }
          },
          "aggs": {
            "3": {
              "terms": {
                "field": "sentiment_analysis.sentiment",
                "size": 5,
                "order": {
                  "_count": "desc"
                }
              }
            }
          }
        }
      }
    };

        return request;
    },

    getActiveTravellerAggregation: function (query,size) {

        var request = {
      "query": {
        "query_string": {
          "query": "*",
          "analyze_wildcard": true
        }
      },
      "size": 0,
      "aggs": {
        "2": {
          "terms": {
            "field": "user.screen_name",
            "size": size,
            "order": {
              "1": "desc"
            }
          },
          "aggs": {
            "1": {
              "cardinality": {
                "field": "place.full_name"
              }
            },
            "3": {
              "terms": {
                "field": "place.full_name",
                "size": 5,
                "order": {
                  "1": "desc"
                }
              },
              "aggs": {
                "1": {
                  "cardinality": {
                    "field": "place.full_name"
                  }
                }
              }
            }
          }
        }
      }
    };

        return request;
    },

    getElectionPopAnalysisAggregation: function (query) {

        var request = {  
         "size":0,
         "query":{  
            "query_string":{  
               "query":"*",
               "analyze_wildcard":true
            }
         },
         "aggs":{  
            "2":{  
               "terms":{  
                  "field":"text",
                  "include":{  
                     "pattern":"uklabour",
                     "flags":"CASE_INSENSITIVE"
                  },
                  "size":0,
                  "order":{  
                     "_count":"desc"
                  }
               }
            },
               "3":{  
                  "terms":{  
                     "field":"text",
                     "include":{  
                        "pattern":"snp",
                        "flags":"CASE_INSENSITIVE"
                     },
                     "size":0,
                     "order":{  
                        "_count":"desc"
                     }
                  }
            },
               "4":{  
                  "terms":{  
                     "field":"text",
                     "include":{  
                        "pattern":"conservative",
                        "flags":"CASE_INSENSITIVE"
                     },      
                     "size":0,
                     "order":{  
                        "_count":"desc"
                     }
                  }
            }
         }
      };

      return request;
    },

    getElectionPartyAnalysisAggregation: function (query, partyName) {

        var request = {
        "size": 0,
        "query": {
          "query_string": {
            "query": "*",
            "analyze_wildcard": true
          }
        },      
        "aggs": {
          "2": {
            "terms": {
              "field": "text",
              "include": {
                "pattern": partyName,
                "flags": "CASE_INSENSITIVE"
              },
              "size": 0,
              "order": {
                "_count": "desc"
              }
            },
            "aggs": {
              "3": {
                "terms": {
                  "field": "sentiment_analysis.sentiment",
                  "size": 3,
                  "order": {
                    "_count": "desc"
                  }
                }
              }
            }
          }
        }
      };
      return request;
    },

    getFavouritePlaceAggregation: function (query, placeName) {

      var request = {
          "size": 0,
          "query": {
            "query_string": {
              "query": placeName,
              "analyze_wildcard": true

            }
          },
          "aggs": {
            "2": {
              "terms": {
                "field": "sentiment_analysis.sentiment",
                "size": 0,
                "order": {
                  "_count": "desc"
                }
              }
            }
          }
      };
      return request;
    },

    getTweetTimeAggregation: function (query,size) {

        var request = {
          "size": 0,
          "query": {
            "query_string": {
              "query": "*",
              "analyze_wildcard": true
            }
          },
          "aggs": {
            "2": {
              "terms": {
                "field": "date.time_type",
                "size": 0,
                "order": {
                  "_count": "desc"
                }
              }
            }
          }
      };
      return request;
    },

    getTweetDaySentimentAggregation: function (query,size) {

        var request = {
          "size": 0,
          "query": {
            "query_string": {
              "query": "*",
              "analyze_wildcard": true
            }
          },
          "aggs": {
            "2": {
              "terms": {
                "field": "date.day_type",
                "size": 0,
                "order": {
                  "_count": "desc"
                }
              },
              "aggs": {
                "3": {
                  "terms": {
                    "field": "sentiment_analysis.sentiment",
                    "size": 0,
                    "order": {
                      "_count": "desc"
                    }
                  }
                }
              }
            }
          }
      };
      return request;
    },


    getClusteredData: function (query, key) {
        
      var request = {
             "search_request":{
              "query": {
                "query_string": {
                  "query": query
                }
              },
              },
              "size": 400000,
	      "query_hint": key,
              "field_mapping":{
		"title": ["_source.title"],
		"content": ["_source.text"]
	       },
	      "algorithm": "lingo",
              "attributes": {
                  "LingoClusteringAlgorithm.desiredClusterCountBase": 5
              },
              "include_hits": true
            };

        return request;
    },

    getWeatherSentimentAggregation: function (query) {

    var request = {
      "query": {
        "query_string": {
          "query": query,
          "analyze_wildcard": true
        }
      },
      "size": 0,
      "aggs": {
        "2": {
          "date_histogram": {
                "field": "date.date_only",
                "interval": "1m",
                "pre_zone": "+10:00",
                "pre_zone_adjust_large_interval": true,
                "min_doc_count": 1
          },
          "aggs": {
            "4": {
              "terms": {
                "field": "date.time_no_second"
              },
	      "aggs":{
	         "3": {
		      "terms": {
		        "field": "sentiment_analysis.sentiment",
		        "size": 3,
		        "order": {
		          "_count": "desc"
		        }
		   }
               }
              }
            }
          }
        }
      }};
      return request;
    },

    getWeatherTypeSentimentAggregation: function (query, date) {

      var request = {
          "size": 0,
          "query": {
            "query_string": {
              "query": date,
              "analyze_wildcard": true

            }
          },
          "aggs": {
            "2": {
              "terms": {
                "field": "sentiment_analysis.sentiment",
                "size": 0,
                "order": {
                  "_count": "desc"
                }
              }
            }
          }
      };
      return request;
    }
}
