


export function Loading () {
    
const spinnerTl = new TimelineMax({repeat: -1, repeatDelay: .75});
const speed = 1;
const angle = 45;
const origin = "center center";
const increase = "-=.9"
const spinEase = Power0.easeOut;

spinnerTl
  .to("#bigCircles", speed, {
    rotation: angle, 
    transformOrigin: origin, 
    ease: spinEase})
  .to("#medCircles", speed, {
    rotation: angle, 
    transformOrigin: origin, 
    ease: spinEase}, increase)
  .to("#smallCircles", speed, {
    rotation: angle, 
    transformOrigin: origin, 
    ease: spinEase}, increase);


}