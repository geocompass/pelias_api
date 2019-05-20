module.exports = {
  'query': {
    'bool': {
      'must': [{
        'multi_match': {
          'fields': ['name.default^1', 'name.en^2'],
          'analyzer': 'peliasQuery',
          'query': 'k road',
          'cutoff_frequency': 0.01,
          'type': 'phrase',
          'operator': 'and',
          'slop': 3
        }
      }, {
        'multi_match': {
          'fields': [
            'parent.country.ngram^1',
            'parent.dependency.ngram^1',
            'parent.macroregion.ngram^1',
            'parent.region.ngram^1',
            'parent.county.ngram^1',
            'parent.localadmin.ngram^1',
            'parent.locality.ngram^1',
            'parent.borough.ngram^1',
            'parent.neighbourhood.ngram^1',
            'parent.locality_a.ngram^1',
            'parent.region_a.ngram^1',
            'parent.country_a.ngram^1',
            'name.default^1.5'
          ],
          'query': 'laird',
          'analyzer': 'peliasAdmin',
          'type': 'cross_fields'
        }
      }],
      'should':[
        {
          'match': {
            'address_parts.street': {
              'query': 'k road',
              'cutoff_frequency': 0.01,
              'boost': 1,
              'analyzer': 'peliasQuery'
            }
          }
        },
        {
        'function_score': {
          'query': {
            'match_all': {}
          },
          'max_boost': 20,
          'score_mode': 'first',
          'boost_mode': 'replace',
          'functions': [{
            'field_value_factor': {
              'modifier': 'log1p',
              'field': 'popularity',
              'missing': 1
            },
            'weight': 1
          }]
        }
      },{
        'function_score': {
          'query': {
            'match_all': {}
          },
          'max_boost': 20,
          'score_mode': 'first',
          'boost_mode': 'replace',
          'functions': [{
            'field_value_factor': {
              'modifier': 'log1p',
              'field': 'population',
              'missing': 1
            },
            'weight': 3
          }]
        }
      }]
    }
  },
  'sort': [ '_score' ],
  'size': 20,
  'track_scores': true
};
