{"size":0,"query":{"filtered":{
"query": { "wildcard": { "text": "*" }},
"filter":
{"bool":{ "should":[
{"geo_polygon":{
	"coordinates":{"points":[{
		"lat":144.98793,"lon":-37.8296219990857},{"lat": 144.9911430000001,"lon":-37.8330519990857},{"lat": 144.9964230000001,"lon":-37.83427899908566},
		{"lat": 145.0006890000001,"lon":-37.83346399908569},{"lat": 145.003675,"lon":-37.83448899908565},
		{"lat": 145.0042500000001,"lon":-37.83395299908569},{"lat": 145.00395,"lon":-37.83144599908568},
		{"lat": 145.006442,"lon":-37.8315759990857},{"lat": 145.0097060000001,"lon":-37.83352099908564},{"lat": 145.011025,"lon":-37.83128699908568},
		{"lat": 145.013141,"lon":-37.83053999908569},{"lat": 145.016826,"lon":-37.83225899908566},{"lat": 145.0189190000001,"lon":-37.83162399908569},
		{"lat": 145.0210070000001,"lon":-37.83206799908569},{"lat": 145.022911,"lon":-37.83417299908565},{"lat": 145.02439,"lon":-37.83445099908568},
		{"lat": 145.0283450000001,"lon":-37.8310549990857},{"lat": 145.023133,"lon":-37.8280499990857},{"lat": 145.021823,"lon":-37.82542599908575},
		{"lat": 145.018312,"lon":-37.82621199908574},{"lat": 145.016246,"lon":-37.82469499908574},{"lat": 145.014395,"lon":-37.81632699908583},
		{"lat": 145.0154070000001,"lon":-37.81214499908585}]}}}]}}}},"aggs":{"2": {
                    "terms": {
                    	"field": "entities.hashtags.text",
                      "size": 5,
                      "order": {
                        "_count": "desc"
                      }
                    }
                  }
                 }
}