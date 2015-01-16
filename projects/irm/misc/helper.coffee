fix = (s) ->
  res = (i.replace(/^\s+|\s+$/g,"") for i in s.split("\"")).filter((j) -> j isnt '')
  res

fixParteners = (o) ->
  o.partners = fix(o.partners)
  o

newData = (data) ->
  (fixParteners(v.progetto) for k, v of data.progetti)

getYears = (data) ->
  o = {}
  for obj in data
    year = obj["Start Date"][6..]
    if o[year] then o[year] += 1 else o[year] = 1
  ( { "year": k, "value": v } for k, v of o )

getPartners = (data) ->
  o = {}
  for obj in data
    for partner in obj.partners
      if partner is not obj["Organization Name"]
        if o[partner] then o[partner] += 1 else o[partner] = 1
  res = ( { "partner": k, "value": v } for k, v of o )
      .sort( (a,b) -> b.value - a.value )[..14]

getThemes = (data) ->
  o = {}
  for obj in data
    theme = obj["PGA"][4..]
    if o[theme] then o[theme] += 1 else o[theme] = 1
  res = ( { "theme": k, "value": v } for k, v of o )
      .sort( (a,b) -> b.value - a.value )[..8]

filterProjects = (data, k) ->
  data.filter (p) ->
    year = p["Start Date"][6..]
    theme = p["PGA"][4..]
    (if k.year then k.year is year else 1) and 
    (if k.theme then k.theme is theme else 1) and
    (if k.partner then k.partner in p.partners else 1)