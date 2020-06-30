console.log("J");
function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    

    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
}
  
function initializeClock(id, endtime) {
    const clock = document.getElementById(id);
    const daysSpan = clock.querySelector('.days');
    const hoursSpan = clock.querySelector('.hours');
    const minutesSpan = clock.querySelector('.minutes');
    const secondsSpan = clock.querySelector('.seconds');
  
    function updateClock() {
      const t = getTimeRemaining(endtime);
      
      console.log(t);
      //document.getElementById("days").textContent = t.days;
      document.getElementById("hours").textContent = ('0' + t.hours).slice(-2);
      document.getElementById("minutes").textContent = ('0' + t.minutes).slice(-2);
      document.getElementById("seconds").textContent = ('0' + t.seconds).slice(-2);
      //daysSpan.innerHTML = t.days;
      // hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      // minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      // secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
      
      if (t.total <= 0) {
        clearInterval(timeinterval);
        window.location.replace("/logout");
      }
    }
    
    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
  }
  
  let deadline;

// if there's a cookie with the name myClock, use that value as the deadline
if(document.cookie && document.cookie.match('myClock')){
  // get deadline value from cookie
  deadline = document.cookie.match(/^(.*)myClock=([^;]+)(.*)$/)[2];
  console.log(deadline);
} else {
  // otherwise, set a deadline 10 minutes from now and 
  // save it in a cookie with that name

  // create deadline 10 minutes from now
  const timeInMinutes = 10;
  const currentTime = Date.parse(new Date());
  deadline = new Date(currentTime + timeInMinutes*60*1000);
  console.log(deadline);
  // store deadline in cookie for future reference
  document.cookie = 'myClock=' + deadline + '; path=/; domain=127.0.0.1';
} 

initializeClock('clockdiv', deadline);