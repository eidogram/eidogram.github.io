exports ? this

this.flubud = {

    # manipulate original fasta file
    manipulate : (t) ->
      infos = []
      sequences = []
      format = d3.time.format("%Y-%m-%d")
      getInfo = (s) ->
        s = s[1..].split('|')
        {
          'date': format.parse(s[0].trim())
          'strain': s[1].trim()
        }
      fix = (s ,index, array) ->
        if s[0] is '>'
          sequences.push('')
          infos.push(getInfo(s))
        else
          sequences[sequences.length - 1] += s
      lines = t.split('\n')
      lines.forEach(fix)
      [infos,sequences]

    mkPart : (s) ->
      res = '1'
      for i in [1..s.length - 1]
        res += if s[i] is s[i-1] then '0' else '1'
      res

    eqClasses : (partitions) ->
      res = {}
      for part, index in partitions
        (res[part] or (res[part] = [])).push(index)
      res

    entropy : (p) ->
      res = 0
      count = 1
      for i in p
        do (i) -> 
          if i is '0'
            count += 1
          else if count > 1
            res -= count * Math.log count
            count = 1
      if count > 1
        res -= count * Math.log count
      res/p.length + Math.log p.length

    mcf : (p,q) ->
      [0..p.length-1].reduce ((previous,j) -> previous + (+p[j] and +q[j])), ''

    mcr : (p,q) ->
      [0..p.length-1].reduce ((previous,j) -> previous + (+p[j] or +q[j])), ''

    rohlin : (p,q) ->
      2 * @.entropy(@.mcr(p,q)) - @.entropy(p) - @.entropy(q)

    reduction : (p,q) ->
      sigma = @.mcf(p,q)
      p_r = '1' + [1..p.length-1].reduce ((previous,j) -> previous + (+p[j] and +(not +sigma[j]))), ''
      q_r = '1' + [1..q.length-1].reduce ((previous,j) -> previous + (+q[j] and +(not +sigma[j]))), ''
      [p_r,q_r]

    rohlin_reduced : (p,q) ->
      [p_r,q_r] = @.reduction(p,q)
      @.rohlin(p_r,q_r)

}
