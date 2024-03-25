let osc, osc2, fft, mic, capture;
let running = false;
function setup() {
  noLoop();
  createCanvas(1220, 700);
  rectMode(CENTER);
  noStroke();

  // osc = new p5.TriOsc(); // set frequency and type
  // osc.amp(0.5);
  // osc.start();
  
  // osc2 = new p5.TriOsc(); // set frequency and type
  // osc2.amp(0.5);
  // osc2.start();

  // fft = new p5.FFT();

  // mic = new p5.AudioIn();
  // mic.start();
  // fft.setInput(mic);

  // Create a video capture object
  capture = createCapture(VIDEO);
  capture.size(320, 240); // Set the video size
  capture.hide(); // Hide the video feed
  
}

function draw() {
  if(running) {
  background(255);

  // Draw the camera input
  capture.loadPixels();
  for (let cy = 0; cy < capture.height; cy += 10) {
    for (let cx = 0; cx < capture.width; cx += 2) {

      let offset = ((cy * capture.width) + cx) * 4;

      // Map sound level to color
      let spectrum = fft.analyze();
      let soundLevel = mic.getLevel();
//       let r = map(soundLevel, 0, 1, 0, 255);
//       let g = map(spectrum[cx], 0, 255, 0, 255); // Use frequency for green component
//       let b = map(spectrum[cy], 0, 255, 0, 255);

//       // Map green component to a gradient from warm to cold
//       g = map(g, 0, 255, 0, 200); // Warm to cold gradient

      // Additional color component mappings
      let r = map(soundLevel, 0, 1, 0, 255);
      let g = spectrum[cx]; // Re-assigning g to maintain its mapping
      let b = spectrum[cy];

      // Yellow color component mapping
      let y = map(soundLevel, 0, 1, 0, 255);

      let c = color(r, g, b, 50);

      // Add yellow component to the color
      c.setRed(r + y);
      c.setGreen(g + y);

      fill(c);

      // Set smaller texture pixels
      let xpos = ((capture.width-cx) / capture.width) * width;
      let ypos = (cy / capture.height) * height;
      noStroke();
      rect(xpos, ypos, 6, 6 * (capture.pixels[offset + 5] / 5));
    }
  }

  // Visualizing audio waveform
  let waveform = fft.waveform(); // analyze the waveform
  //console.log(waveform.length)
  beginShape();
  strokeWeight(1);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();

  // Change oscillator frequency based on mouseX
  let freq = map(mouseX, 0, width, 10, 10000);
  let freq2 = map(mouseY, 0, height, 10, 10000)
  
  // let freq = map(brainData, 0, width, 10, 10000);
  //console.log(mouseX, freq)
  osc.freq(freq);
  osc2.freq(freq2);

  // amplitude
  //let amp = map(mouseY, 100, height, 10, 0.01);
  osc.amp(0.5);
  osc2.amp(0.5)
}
}

// initialize the sketch when user clicks anywhere in the window
window.addEventListener('click', (e) => {
  osc = new p5.TriOsc(); // set frequency and type
  osc.amp(0.5);
  osc.start();
  
  osc2 = new p5.TriOsc(); // set frequency and type
  osc2.amp(0.5);
  osc2.start();

  fft = new p5.FFT();

  mic = new p5.AudioIn();
  mic.start();
  fft.setInput(mic);
  loop()
  running = true;
})