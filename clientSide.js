const waveClient = require("xesto-wave")("c0cbe00e85cf4f52b6ffc4b743982b81");
const superagent = require("superagent"); // allows us to serve post requests
var fs = require('fs');


// start listening from the waveClient controller
waveClient.connect().then( controller => {
	// handle the case of the SpeedUp gesture

  const request = ( speed ) => {
  	return new Promise(( resolve, reject ) => {
  		superagent.post('/')
  			.send({ speed: speed })
  				.catch( err => reject( err ))
  				.then( response => resolve( response ));
  	})
  }

  // pass a different value to the request depending on what direction the 
  const speedUp = () => request( 2 );
  const slowDown = () => request( 3 );
  const pause = () => request( 0 );
  const resume = () => request( 1 );

  let frames = [];
  let handInView = false;

  findLastFiveFrames =(frames) => {
  	return frames.reverse().slice(0,5);
  }

  findPalmPositions = (frames)=>{
  	return frames.map((frame) => {
  		return frame.hands[0].palmPosition;
  	});
  }

  // figure out which direction the hand is moving, four for four commands
  findDirection = (frames) => {
  	palmPositions = findPalmPositions(frames);
  	left = isLeft(palmPositions);
  	right = isRight(palmPositions);
  	upward = isUpward(palmPositions);
  	forward = isForward(palmPositions);

  	trueOnes = [];

  	if (left[0]) {
  		trueOnes.push({name: "left", value: left[1]});
  	}

  	if (right[0]) {
  		trueOnes.push({name: "right", value: right[1]});
  	}

  	if (upward[0]) {
  		trueOnes.push({name: "upward", value: upward[1]});
  	}

  	if (forward[0]) {
  		trueOnes.push({name: "forward", value: forward[1]});
  	}

  	result = trueOnes.reduce(( one, two )=> {
  		return Math.max(Math.abs(one.value), Math.abs(two.value));
  	});
  	console.log( result )
  	return result.name;
  } 

  // check if it's a specific direction based on the change in the x y z position in the 3D grid

  isLeft = (palmPositions) => {
  	xcoords = findXCoordinates(palmPositions);
  	first = xcoords[0];
  	last = xcoords.reverse()[0];
  	diff = last - first;
  	return [diff > 0, diff];
  }


  isRight = (palmPositions) => {
  	xcoords = findXCoordinates(palmPositions);
  	first = xcoords[0];
  	last = xcoords.reverse()[0];
  	diff = last - first;
  	return [diff < 0, diff];
  }


  isForward = (palmPositions) => {
  	zcoords = findZCoordinates(palmPositions);
  	first = zcoords[0];
  	last = zcoords.reverse()[0];
  	diff = last - first;
  	return [diff > 0, diff];
  }


  isUpward = (palmPositions) => {
  	ycoords = findYCoordinates(palmPositions);
  	first = ycoords[0];
  	last = ycoords.reverse()[0];
  	diff = last - first;
  	return [diff > 0, diff];
  }

  // use the different coordinates to calcluate differences and see what direction the hand is moving in
  
  findXCoordinates = (palmPositions) => {
  	return palmPositions.map((position) => position[0])
  }

  findDiffs  = (first, last) => {
  	return last - first;
  }

  findYCoordinates = (palmPositions) => {
  	return palmPositions.map((position) => position[1])
  }
  findZCoordinates = (palmPositions) => {
  	return palmPositions.map((position) => position[2])
  }

  controller
  	.use('handEntry')
  	.on('handLost', () => {
  		handInView = false;
  		lastFiveFrames = findLastFiveFrames(frames);
  		direction = findDirection(lastFiveFrames);
  		if ( direction === "right" ) {
  			speedUp().then(() => console.log("Speeding up!"));
  		}
  	})
  	.on('handFound', () => {
  		handInView = true;
  	})
  	.on("frame", ( frame ) => {
  		if ( handInView ) {
  			frames.push( frame );
  			console.log("dot");
  		}
  	})

  controller.connect();
})
