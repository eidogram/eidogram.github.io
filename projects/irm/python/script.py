import csv
import pickle
import json

from geopy.geocoders import Nominatim

def readFile(filedotcsv):
  """
  """
  
  # Create a Python dict with relevant information
  res = {}
  with open(filedotcsv, newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
      res[row[1]] = {"city": row[-2], "country": row[-1]}
   
  # get a list of places to geolocalize
  s = set()
  for v in res.values():
    s.add(",".join([v["city"],v["country"]]))
  print(len(s))

  #geolocate cities
  coords = {}
  failed = []
  geolocator = Nominatim()
  i = 0
  for city in s:
    i = i + 1
    print(i/len(s))
    try:
      location = geolocator.geocode(city, timeout=20)
      try:
        coords[city] = [location.latitude, location.longitude]
        pickle.dump( coords, open( "coords.p", "wb" ) )
      except AttributeError:
        print(city)
        failed.append(city)
        pickle.dump( failed, open( "failed.p", "wb" ) )
    except geopy.exc.GeocoderTimedOut:
      print(city)
      failed.append(city)
      pickle.dump( failed, open( "failed.p", "wb" ) )

  return None

def helper(coords, city, country):
  """
  """
  try:
    c = coords[",".join([city,country])]
    return [round(c[0],2),round(c[1],2)]
  except KeyError:
    return []

def createJson():
  """
  """
  coords = pickle.load( open( "coords.p", "rb" ) )
  res = {}
  with open("data.csv", newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
      res[row[1].lower()] = helper(coords, row[-2], row[-1])
      # res[row[1]] = {
      #   #"city": row[-2],
      #   #"country": row[-1],
      #   #"coords": helper(coords, row[-2], row[-1])
      # }

  # print json
  with open('coords.json', 'w') as jf:
    json.dump(res, jf)

def printFailed():
  """
  """
  failed = pickle.load( open( "failed.p", "rb" ) )
  with open('failed.txt', 'w') as f:
    for city in failed:
      f.write(city+'\n')





