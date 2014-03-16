#!/usr/bin/python2

#import pysparse
#import numpy
import csv, math, time, random, pickle, json
import pylab, numpy

def M():
  """
  """
  mat = numpy.array([numpy.zeros(100*100) for i in xrange( 6 * 24 )]) # 1 entry every 10 minutes for a day
  days = set()
  november = [(str(i).zfill(2),'11') for i in range(1,31)]
  december = [(str(i).zfill(2),'12') for i in range(1,24)]
  daynumbers = november + december
  for daynumber in daynumbers:
    print daynumber
    myfile = '/media/disco/bigdata/telecom/sms-call-internet-mi-2013-' + daynumber[1] + '-' + daynumber[0] + '.txt'
    with open(myfile, 'rb') as csvfile:
      spamreader = csv.reader(csvfile, delimiter='\t')
      for row in spamreader:
        if row[2] == '39' and time.strftime('%w', time.localtime(int(row[1])/1000.)) not in ['0','6']:
          etime = int(row[1])
          cell = int(row[0]) - 1
          value = convert(row[3]) # sms-in
          #value = convert(row[4]) # sms-out
          #value = convert(row[5]) # call-in
          #value = convert(row[6]) # call-out
          #value = convert(row[7]) # internet
          #value = convert(row[3]) + convert(row[4]) + convert(row[5]) + convert(row[6]) # sms and calls
          days.add(time.strftime('%Y-%m-%d', time.localtime(etime/1000.)))
          mat[t_i(etime)][cell] += value
  n = len(days)
  print 'giorni: ',n
  mat = mat / float(n)
  return mat

def mkJson(M):
  """
  """
  with open('mat.json', 'w') as outfile:
    json.dump(numpy.round(M,2).tolist(), outfile)

def cutoff(x):
  """
  """
  # mat A
  #k = 0.013
  #k = 0.015

  # mat D
  #k = 0.0004
  #k = 0.0006

  # mat D
  k1 = 0.0005 - 0.0001
  k2 = 0.0005 + 0.0001

  # mat A
  k1 = 0.0145
  k2 = 0.0155

  return int( k1 < x < k2 )

def simplify(M):
  """
  simplify matrix m according to the cutoff function.
  """
  f = numpy.vectorize(cutoff)
  return [f(m).tolist() for m in M]

def toNpArray(M):
  """
  """
  return numpy.array([numpy.array(m) for m in M])

def mkJsonSimplify(M):
  """
  return json file
  """
  m = simplify(M)
  res = [[i for i,v in enumerate(d) if v == 1] for d in m]
  print "cells #: ",sum([len(l) for l in res])
  with open('mat.json', 'w') as outfile:
    json.dump(res, outfile)

# def mkJsonSimplifyDiff(M):
#   """
#   """
#   m = simplify(M)
#   simpl = [ [i for i,v in enumerate(d) if v == 1] for d in m]
#   res = [ [ simpl[0], [] ] ]
#   for i in xrange(1,144):
#     B = set(simpl[i])
#     A = set(simpl[i - 1])
#     res.append([list( A - B ),list( B - A)])
#   with open('matdiff.json', 'w') as outfile:
#     json.dump(res, outfile)  

def plotArrays(M):
  """
  """
  pylab.figure(figsize=(10,5))
  for i in M:
    pylab.plot(i)
  pylab.savefig('tmp.png')
  pylab.close()

def matHist(M):
  """
  """
  r = []
  for m in M:
    r = r + m.tolist()
  pylab.figure(figsize=(10,5))
  pylab.hist(r,50)
  pylab.savefig('tmp.svg')
  pylab.close()

def mkvideo(M):
  """
  the use the command
  $ ffmpeg -r 10 -i f%04d.png movie.mp4
  """
  for i in xrange(len(M)):
    print i
    pM(M[i],"plots/f"+str(i).zfill(4)+".png")
  return None

def pM(M,name):
  """
  plot matrix
  """
  M.shape = (100,100)
  pylab.figure(figsize=(10,5))
  pylab.imshow(M)
  pylab.savefig(name)
  pylab.close()


def D(M):
  """
  """
  D = []
  for m in M:
    den = sum(m)
    D.append(m / den)
  return numpy.array(D)

def A(M):
  """
  """
  A = []
  for m in M.T:
    den = sum(m)
    if den > 0.01:
      A.append(m / den)
    else:
      A.append(m * 0)
  A = numpy.array(A)
  return A.T

def deltaCheck(mat):
  """
  """
  res = [check(mat) for i in xrange(10000)]
  pylab.figure(figsize=(10,5))
  pylab.hist(res,100,(-50,50))
  pylab.savefig('hist.svg')
  pylab.close()
  print numpy.mean(res), numpy.std(res)
  return None

def check(mat):
  """
  """
  while True:
    i = random.randint(0,9999)
    j = random.randint(0,9999)
    t = random.randint(0,143)
    r = random.randint(0,143)
    if mat[r][j] > 0.01 and mat[t][i] > 0.01:
      return mat[t][i]/mat[r][j] - prod_sums(mat,i,t) / prod_sums(mat,j,r)

def prod_sums(mat,i,t):
  """
  """
  return sum(mat[t]) * sum(mat.T[i])

def t_i(z):
  """
  """
  t0 = 1383260400000
  return ( ( z - t0 ) / 600000 ) % 144

def convert(entry):
  """
  """
  try:
    return float(entry)
  except ValueError:
    return 0.

def cellToTime(i):
  """
  """
  h = i * 10 / 60
  m = (i * 10) % 60
  return h,m

# def readFile(myfile):
#   """
#   Return a list of lists. A list, every 10 minutes, that contains the active cells.
#   Ex: [[1,23,455,..],[56,1000,456,..],..]
#   """
#   res = [[] for i in xrange( 6 * 24 )] # 1 entry every 10 minutes for a day
#   with open(myfile, 'rb') as csvfile:
#     spamreader = csv.reader(csvfile, delimiter='\t')
#     for row in spamreader:
#       if row[2] == '39':
#         cell = int(row[0]) - 1
#         time = setTime(row[1])
#         value = convert(row[3]) # sms-in
#         #value = convert(row[4]) # sms-out
#         #value = convert(row[5]) # call-in
#         #value = convert(row[6]) # call-out
#         #value = convert(row[7]) # internet
#         cutoff = 3
#         if value > cutoff:
#           res[time - 1].append(cell)
#   partitions = [clust(cells) for cells in res]
#   distances = [rohlin(partitions[i],partitions[i+1]) for i in xrange(len(partitions)-1)]
#   return distances

# def readFileDiff(myfile):
#   """
#   Return a list of lists. A list, every 10 minutes, that contains the active cells.
#   Ex: [[1,23,455,..],[56,1000,456,..],..]
#   """
#   res = [[] for i in xrange( 6 * 24 )] # 1 entry every 10 minutes for a day
#   tmp = [[] for i in xrange( 100 * 100 )] # 100x100 grid of Milan
#   with open(myfile, 'rb') as csvfile:
#     spamreader = csv.reader(csvfile, delimiter='\t')
#     for row in spamreader:
#       if row[2] == '39':
#         cell = int(row[0]) - 1
#         time = setTime(row[1])
#         value = convert(row[3]) # sms-in
#         #value = convert(row[4]) # sms-out
#         #value = convert(row[5]) # call-in
#         #value = convert(row[6]) # call-out
#         #value = convert(row[7]) # internet
#         tmp[cell].insert(0,(time, value)) # sms-in
#         v = tmp[cell]
#         delta = .5
#         try:
#           deltaTime = v[0][0] - v[1][0]
#           # diff = abs( ( v[0][1] - v[1][1] ) / v[0][1] )
#           diff = relChange(v[0][1],v[1][1], cell, time)
#           if diff >= delta and deltaTime == 1: # avoid cases when deltaTime > 1
#             res[time - 1].append(cell)
#           elif deltaTime > 1:
#             print "time Jump at time and cell ", time, cell
#           v.pop()
#         except IndexError:
#             pass


#   partitions = [clust(cells) for cells in res]
#   distances = [rohlin(partitions[i],partitions[i+1]) for i in xrange(len(partitions)-1)]
#   #distances = [hamming(partitions[i],partitions[i+1]) for i in xrange(len(partitions)-1)]
#   return distances

# def plot(l):
#     """
#     """
#     pylab.figure(figsize=(8,4))
#     pylab.plot(l)
#     pylab.savefig('plot.png')
#     pylab.close()

# def clust(cells):
#   """
#   """
#   cells = sorted(cells)
#   res = {}
#   for cell in cells:
#     if (cell - 1) in res:
#       res[cell] = res[cell - 1]
#     elif (cell - 100) in res:
#       res[cell] = res[cell - 100]
#     else:
#       res[cell] = cell  
#   clust = {}
#   for k,v in res.iteritems():
#     clust.setdefault(v,[]).append(k)
#   return sorted(clust.values())
#   #return sorted([sorted(i) for i in clust.values()])
#   #return set([frozenset(i) for i in clust.values()])

# def relChange(a,b, cell, time):
#   """
#   """
#   try:
#     return abs( ( a - b ) / b ) # relative change
#   except ZeroDivisionError:
#     #print "zero division at time and cell", time, cell
#     return 0

# def setTime(etime):
#   """
#   """
#   return (int(etime) - 1383260400000) / 600000


### Rohlin

# def sortFirst(part):
#   """
#   Sort a list under the assumption that only the first argument is not in order.
#   """
#   if len(part) < 2:
#     return part
#   elif part[0][0] > part[1][0]:
#     return [part[1]] + sortFirst([part[0]] + part[2:])
#   else:
#     return part

# def minComRef(a,b):
#   """
#   a = [[1, 2], [23, 56], [34, 35]]
#   b = [[1, 2, 3], [23], [34, 35, 56]]
#   """
#   if a == b == []:
#     return []
#   elif a != [] and a[0] == []:
#     return minComRef(a[1:],b)
#   elif b != [] and b[0] == []:
#     return minComRef(a,b[1:])
#   elif a == []:
#     return b
#   elif b == []:
#     return a
#   elif a[0] == b[0]:
#     return [a[0]] + minComRef(a[1:],b[1:])
#   elif a[0][0] == b[0][0]:
#     inters = intersection(a[0],b[0])
#     return [inters] + minComRef([compl(inters,a[0])] + a[1:],[compl(inters,b[0])] + b[1:])
#   else:
#     sa = sortFirst(a)
#     sb = sortFirst(b)
#     if sa == a and sb == b:
#       return sortFirst(a + b)
#     else:
#       return minComRef(sa,sb)

# def intersection(a,b):
#   """
#   """
#   return [i for i in a if i in b]

# def compl(inters,b):
#   """
#   """
#   return [i for i in b if i not in inters]

# def entropy(p):
#     """
#     Return Shannon's Entropy H(p) of the partition p:
#     H(p)=-sum_i m(p_i)*ln(m(p_i))
#     NB: the measure here is the atom lenght/area.
#     """
#     A = 100 * 100 # total area
#     h = -sum([len(i) * math.log(len(i)) for i in p])
#     whites = A - sum(len(i) for i in p) 
#     h = h - whites * math.log(whites)
#     return h/A + math.log(A)

# def rohlin(p,q):
#     """
#     Returns the Rohlin distance: R(a,b)=R(b,a)==H(a|b)+H(b|a)
#     """
#     return 2 * entropy(minComRef(p,q)) - entropy(p) - entropy(q)

# def hamming(p,q):
#   """
#   """
#   hp = []
#   hq = []
#   for i in p:
#     hp = hp + i
#   for i in q:
#     hq = hq + i
#   hp = set(hp)
#   hq = set(hq)
#   return len(hp - hq) + len(hq - hp)


### Clustering

#def distanceMatrix(M,sigma=1):
#    """
#    """
#    X = M.T
#    dim = len(X)
#    result = numpy.zeros((dim,dim))
#    for i in xrange(dim):
#        for j in xrange(i+1,dim):
#            result[i][j] = math.exp( - numpy.linalg.norm(X[i]-X[j]) / (2 * sigma) )
#            result[j][i] = result[i][j]
#    return result
#
#from numpy import linalg as nla


#import scipy.spatial
#import scipy.cluster
#def complete_linkage(M):
#  """
#  """
#  X = M.T
#  d = scipy.spatial.distance.pdist(X,'euclidean') # euclidean distances
#  Z = scipy.cluster.hierarchy.complete(d)
#  return Z

#def plotClust(Z,k):
#  """
#  """
#  fl = scipy.cluster.hierarchy.fcluster(Z,k,criterion='maxclust')
#  pM(fl,"clust.png")
#  return None

