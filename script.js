const clockEl = document.getElementById("clock");

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Africa/Cairo",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function updateClock() {
  clockEl.textContent = `Cairo (GMT +2) : ${formatter.format(new Date())}`;
}

updateClock();
setInterval(updateClock, 30_000);
