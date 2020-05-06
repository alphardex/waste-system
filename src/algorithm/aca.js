const initializeArrayWithValues = (n, val = 0) => Array(n).fill(val)
const initialize2DArray = (w, h, val = null) =>
  Array.from({ length: h }).map(() => Array.from({ length: w }).fill(val))
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1))
const randomFloat = (min, max) => min + Math.random() * (max - min)
const calcDistance = (x1, y1, x2, y2) => Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
const deepClone = obj => {
  if (obj === null) return null
  const clone = Object.assign({}, obj)
  Object.keys(clone).forEach(
    key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  )
  return Array.isArray(obj) && obj.length
    ? (clone.length = obj.length) && Array.from(clone)
    : Array.isArray(obj)
      ? Array.from(obj)
      : clone
}

class Ant {
  constructor(id, cityCount, distanceGraph, pheromoneGraph, ALPHA, BETA) {
    this.id = id
    this.cityCount = cityCount
    this.distanceGraph = distanceGraph
    this.pheromoneGraph = pheromoneGraph
    this.ALPHA = ALPHA
    this.BETA = BETA
    this.init()
  }

  init() {
    this.path = []
    this.distanceSum = 0.0
    this.moveCount = 0
    this.cityVisitStates = initializeArrayWithValues(this.cityCount, false)
    const birthPlace = randomInt(0, this.cityCount - 1)
    this.currentCity = birthPlace
    this.path.push(birthPlace)
    this.cityVisitStates[birthPlace] = true
    this.moveCount += 1
  }

  chooseNextCity() {
    let nextCity = null
    const probs = initializeArrayWithValues(this.cityCount, 0.0)
    let probSum = 0
    for (const otherCity of Array(this.cityCount).keys()) {
      if (!this.cityVisitStates[otherCity]) {
        const prob = this.calcProb(this.currentCity, otherCity)
        probs[otherCity] = prob
        probSum += prob
      }
    }
    // 轮盘选择城市
    if (probSum > 0.0) {
      let tempProb = randomFloat(0.0, probSum)
      for (const otherCity of Array(this.cityCount).keys()) {
        if (!this.cityVisitStates[otherCity]) {
          tempProb -= probs[otherCity]
          if (tempProb < 0.0) {
            nextCity = otherCity
            break
          }
        }
      }
    }
    // 若未从概率产生，随机选择一个未访问的城市
    if (!nextCity) {
      nextCity = randomInt(0, this.cityCount - 1)
      while (this.cityVisitStates[nextCity]) {
        nextCity = randomInt(0, this.cityCount - 1)
      }
    }
    return nextCity
  }

  calcProb(i, j) {
    return Math.pow(this.pheromoneGraph[i][j], this.ALPHA) * Math.pow(1.0 / this.distanceGraph[i][j], this.BETA)
  }

  calcDistanceSum() {
    let distanceSum = 0
    for (const otherCity of [...Array(this.cityCount).keys()].slice(1)) {
      const [start, end] = [this.path[otherCity], this.path[otherCity - 1]]
      distanceSum += this.distanceGraph[start][end]
    }
    // 回路
    const start = this.path[this.cityCount - 1]
    const end = this.path[0]
    distanceSum += this.distanceGraph[start][end]
    this.distanceSum = distanceSum
  }

  move(nextCity) {
    this.path.push(nextCity)
    this.cityVisitStates[nextCity] = true
    this.distanceSum += this.distanceGraph[this.currentCity][nextCity]
    this.currentCity = nextCity
    this.moveCount += 1
  }

  searchPath() {
    this.init()
    while (this.moveCount < this.cityCount) {
      const nextCity = this.chooseNextCity()
      this.move(nextCity)
    }
    this.calcDistanceSum()
  }
}

class ACA {
  constructor(antCount, cityCount, xycoords, ALPHA = 1.0, BETA = 2.0, RHO = 0.5, Q = 100.0) {
    this.ALPHA = ALPHA
    this.BETA = BETA
    this.RHO = RHO
    this.Q = Q
    this.cityCount = cityCount
    this.antCount = antCount
    const distanceGraph = initialize2DArray(cityCount, cityCount, 0.0)
    this.distanceGraph = distanceGraph
    this.xycoords = xycoords
    this.getDistanceGraph()
    const pheromoneGraph = initialize2DArray(cityCount, cityCount, 1.0)
    this.pheromoneGraph = pheromoneGraph
    this.ants = Array(antCount).fill(1).map((ant, i) => new Ant(i, cityCount, distanceGraph, pheromoneGraph, ALPHA, BETA))
    this.bestAnt = new Ant(-1)
    this.bestAnt.distanceSum = 2 ** 30
    this.iterCount = 1
    this.result = []
  }

  getDistanceGraph() {
    for (const i of Array(this.cityCount).keys()) {
      for (const j of Array(this.cityCount).keys()) {
        const x1 = this.xycoords[i][0]
        const x2 = this.xycoords[j][0]
        const y1 = this.xycoords[i][1]
        const y2 = this.xycoords[j][1]
        const distance = calcDistance(x1, y1, x2, y2)
        this.distanceGraph[i][j] = distance
      }
    }
  }

  searchPathOnce() {
    this.ants.forEach(ant => {
      ant.searchPath()
      if (ant.distanceSum < this.bestAnt.distanceSum) {
        this.bestAnt = deepClone(ant)
      }
    })
    this.updatePheromoneGraph()
    console.log(`[${this.iterCount}]最佳距离: ${this.bestAnt.distanceSum}`)
    this.result.push(this.bestAnt.distanceSum)
    this.iterCount += 1
  }

  updatePheromoneGraph() {
    const tempPheromone = initialize2DArray(this.cityCount, this.cityCount, 0.0)
    this.ants.forEach(ant => {
      for (const otherCity of [...Array(this.cityCount).keys()].slice(1)) {
        // 在路径上的每两个相邻城市间留下信息素，与路径总距离成反比
        const [start, end] = [ant.path[otherCity - 1], ant.path[otherCity]]
        tempPheromone[start][end] += this.Q / ant.distanceSum
        tempPheromone[end][start] = tempPheromone[start][end]
      }
    })
    for (const i of Array(this.cityCount).keys()) {
      for (const j of Array(this.cityCount).keys()) {
        this.pheromoneGraph[i][j] = this.RHO * this.pheromoneGraph[i][j] + tempPheromone[i][j]
      }
    }
  }

  searchPath(iterCount) {
    for (const i of Array(iterCount).keys()) {
      this.searchPathOnce()
    }
    console.log(`${this.result}`)
  }
}

module.exports = ACA
