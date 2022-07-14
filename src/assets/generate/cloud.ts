// @see https://codepen.io/dennishadley/pen/KEXVWm?editors=0010
function makeCloud() {
  const getRandomInRange = function (min, max) {
    return (Math.random() * (max - min)) + min
  }
  
  const createTuft = function (baseCloudSize, tuftSize, farSide) {
    const calcTuftXPosition = function (cloudR, tuftR) {
      const minOffset = tuftR * .4;
      const maxOffset = tuftR;
      const offset = getRandomInRange(minOffset, maxOffset);
      return (cloudR * 2 - (cloudR - tuftR)) - offset;
    }
    
    const calcTuftZPosition = function (cloudR, tuftR) {
      const minOffset = tuftR * .4;
      const maxOffset = tuftR * .6;
      const offset = getRandomInRange(minOffset, maxOffset);
      const negative = Math.random() >= 0.5;
      return offset * negative ? -1 : 1;
    }
    
    const tuft = new THREE.SphereGeometry(tuftSize, 10, 10)
    const tuftXPos = calcTuftXPosition(baseCloudSize, tuftSize) * (farSide ? -1 : 1)
    const tuftZPos = calcTuftZPosition(baseCloudSize, tuftSize)
    
    tuft.translate(tuftXPos, 0, tuftZPos)
    
    return tuft
  }
  
  const map = (val, smin, smax, emin, emax) => (emax-emin)*(val-smin)/(smax-smin) + emin
  const jitter = (geo,per) => geo.vertices.forEach(v => {
      v.x += map(Math.random(),0,1,-per,per)
      v.y += map(Math.random(),0,1,-per,per)
      v.z += map(Math.random(),0,1,-per,per)
  })
  const chopBottom = (geo,bottom) => geo.vertices.forEach(v => v.y = Math.max(v.y,bottom))
  const numTufts = 2;
  
  const minCloudSize = 1.2;
  const maxCloudSize = 2.2;
  
  const geo = new THREE.Geometry()

  const baseCloudSize = getRandomInRange(minCloudSize, maxCloudSize);
  const baseCloud = new THREE.SphereGeometry(baseCloudSize,10,10)

  baseCloud.translate(0,0,0)
  geo.merge(baseCloud)

  for (var i = 0; i < numTufts; i++) {
    const tuftSize = getRandomInRange(minCloudSize, baseCloudSize * 0.6) 
    const tuft = createTuft(baseCloudSize, tuftSize, (i % 2 == 0) ? false : true) 
    geo.merge(tuft)
  }
  
  jitter(geo, 0.2)
  chopBottom(geo,-0.4)
  geo.computeFlatVertexNormals()

  return new THREE.Mesh(
    geo,
    new THREE.MeshLambertMaterial({
      color:'white',
      flatShading:true,
    })
  )
}