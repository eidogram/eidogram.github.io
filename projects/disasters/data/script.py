# -*- coding: utf-8 -*-

import json

def mkjson():
    """
    """
    iso2 = {} # Alpha-2 (iso 3166) codes: iso2[u'KR'] = u'Korea, Republic of'
    latlng = {} # Alpha-2 (iso 3166) codes: coords[u'KR'] = [lat,long]
    deplacement = {}

    with open("ISO-3166-2-codes.txt") as f:
        for line in f:
            x = line.split(';')
            #iso2[x[1].decode('utf-8').strip()] = x[0].decode('utf-8').lower()
            iso2[x[0].decode('utf-8').lower()] = x[1].decode('utf-8').strip()    # iso2[u'Korea, Republic of'] = u'KR'
    with open("country_latlon.csv") as f:
        for line in f:
            x = line.split(',')
            latlng[x[0].decode('utf-8').strip()] = [float(x[1].decode('utf-8')),float(x[2].decode('utf-8').strip())]
    with open("nrc01.csv") as f:
        for line in f:
            x = line.split(';')
            deplacement[x[0].decode('latin').strip().lower()] = int(x[1].decode('latin').strip())

    data = []
    for country in deplacement.iterkeys():
      try:
        code = iso2[country]
        data.append({'country':country, 'code':code, 'deplacement':deplacement[country], 'lat':latlng[code][0], 'lng':latlng[code][1] })
      except KeyError:
        print code, country
        pass

    with open('data.json', 'w') as outfile:
      json.dump(data, outfile)

    return None
