//group id generator
//based off of a singleton
module.exports = function getNewGroup(){
  if(typeof(getNewGroup.counter) == 'undefined'){
    getNewGroup.counter = 0;
  }
  getNewGroup.counter++;
  return getNewGroup.counter;
};
